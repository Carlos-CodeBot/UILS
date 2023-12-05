import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { environment } from "src/environments/environment";

export interface Trip {
    id: number;
    driverName: string;
    dirRoutes: string[];
    departuretime: string;
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

@Injectable({
    providedIn: 'root',
})
export class TripsService {
    constructor(private http: HttpClient) { }
    
    getAll() {
        return of([{
            id: -1,
            driverName: 'Oscar Lopez',
            dirRoutes: ['Calle 28 #1-16', 'Calle 21#1-15'],
            availableSeats: 2,
            departuretime: '08:15:00',
            coordinates: ['7.20,-75', '10, -65'],
            vehicle: {
                id: 1,
                brand: 'Mazda',
                model: '3 2023',
                licensePlate: 'ABC-123',
                color: 'rojo',
                capacity: 4,
            },
            price: 100.0
        }] as Trip[]);
        return this.http.get<Trip[]>(`${environment.urlBack}/trips/all`);
    }

    new(body: {
        dirRoutes: string[];
        coordinates: string[];
        price: number;
    }) {
        return this.http.post<boolean>(`${environment.urlBack}/trips/new`, {...body});
    }

    join(tripId: number) {
        return of(true);
        return this.http.post(`${environment.urlBack}/trips/join/${tripId}`, {});
    }

    leave(tripId: number) {
        return of(true);
        return this.http.delete(`${environment.urlBack}/trips/leave/${tripId}`);
    }
}