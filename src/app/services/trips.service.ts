import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, of } from "rxjs";
import { environment } from "src/environments/environment";

export interface Trip {
    id: number;
    driverName: string;
    dirRoutes: string[];
    departureTime: string;
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
        // return of([{
        //     id: -1,
        //     driverName: 'Oscar Lopez',
        //     dirRoutes: ['Calle 28 #1-16', 'Calle 21#1-15'],
        //     availableSeats:,
        //     departureTime: '08:15:00',
        //     coordinates: ['7.20,-75', '10, -65'],
        //     vehicle: {
        //         id: 1,
        //         brand: 'Mazda',
        //         model: '3 2023',
        //         licensePlate: 'ABC-123',
        //         color: 'rojo',
        //         capacity: 4,
        //     },
        //     price: 100.0
        // }] as Trip[]);
        return this.http.get<Trip[]>(`${environment.urlBack}/trips/all`);
    }

    new(body: {
        dirRoutes: string[];
        coordinates: string[];
        price: number;
        departureTime: string;
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

    getChat(idTrip: number) {
        return this.http.get<TripChat>(`${environment.urlBack}/chat/${idTrip}`);
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