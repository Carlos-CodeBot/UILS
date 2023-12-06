import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, of } from "rxjs";
import { environment } from "src/environments/environment";

export interface Trip {
    id: number;
    driverName: string;
    dirRoutes: string[];
    departureTime: string;
    startingPlace: string;
    availableSeats: number;
    coordinates: string[];
    vehicle: {
        id: number;
        brand: string;
        model: string;
        licensePlate: string;
        color: string;
        capacity: number;
    };
    price: number;
}

export interface TripChat {
    id: number;
    chatStatus: 'open' | 'closed',
    driverName: string;
    messages: {
        id: number;
        senderId: number;
        senderName: string;
        message: string;
        time: string;
    }[]
}

@Injectable({
    providedIn: 'root',
})
export class TripsService {
    currTrip: Trip;
    currTrip$ = new Subject<Trip>();
    constructor(private http: HttpClient) { }
    
    getAll() {
        return this.http.get<Trip[]>(`${environment.urlBack}/trips/all`);
    }

    new(body: {
        dirRoutes: string[];
        coordinates: string[];
        price: number;
        departureTime: string;
        startingPlace: string;
    }) {
        return this.http.post<boolean>(`${environment.urlBack}/trips/new`, {...body});
    }

    join(tripId: number) {
        return this.http.post(`${environment.urlBack}/trips/join/${tripId}`, {});
    }

    leave(tripId: number) {
        return this.http.delete(`${environment.urlBack}/trips/leave/${tripId}`);
    }

    delete(tripId: number) {
        return this.http.delete(`${environment.urlBack}/trips/${tripId}`);
    }
    
    finish(tripId: number) {
        return this.http.post(`${environment.urlBack}/trips/finish/${tripId}`, {});
    }

    getCurrent() {
        return this.http.get<Trip>(`${environment.urlBack}/trips`);
    }

    getChat(tripId: number, addHeader?: boolean) {
        // return of({
        //     id: -1,
        //     chatStatus: 'open',
        //     driverName: 'Carlos Belcast',
        //     messages: [
        //         {
        //             id: -1,
        //             senderId: 7,
        //             senderName: 'Carlos Belcast',
        //             message: 'Hola a todosss',
        //             time: new Date().toString(),
        //         },
        //         {
        //             id: -1,
        //             senderId: 7,
        //             senderName: 'Carlos Belcast',
        //             message: 'Hola a todosss',
        //             time: new Date().toString(),
        //         }
        //     ]
        // } as TripChat);
        return this.http.get<TripChat>(`${environment.urlBack}/chat/${tripId}`, {
            headers: addHeader ? {'SILENT-REQUEST': 'true'} : {},
        });
    }

    sendMessageChat(tripId: number, message: string) {
        return this.http.post<boolean>(
            `${environment.urlBack}/chat/send/${tripId}`,
            {
                message
            },
            {
                headers: {
                'SILENT-REQUEST': 'true',
            }
        });
    }

    loadCurrent() {
        this.getCurrent().subscribe({
            next: (res) => {
                if (!res) {
                    this.currTrip = null;
                    this.currTrip$.next(null);
                };

                res.departureTime = new Date('1970-01-01 ' + res.departureTime).toString();

                this.currTrip = res;

                localStorage.setItem('onTrip', '1');
                localStorage.setItem('trip', JSON.stringify(res));
                this.currTrip$.next(res);
            },
            error: (_err) => {
                this.currTrip = null;
                this.currTrip$.next(null);
            }
        });
    }
}