import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class MapService {
    publishRoute: any[];

    constructor(private http: HttpClient) {}

    getAddress(latitude: number, longitude: number) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        return this.http.get(url);
    }
}