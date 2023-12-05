import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, of } from "rxjs";
import { environment } from "src/environments/environment";
import { SnackbarService } from "../shared/services/snackbar.service";

export interface UserData {
    id: number;
    username: string;
    fullName: string;
    phoneNumber: number;
    email: string;
    role: 'passenger' | 'driver';
    vehicle?: {
        id: number;
        brand: string;
        model: string;
        licensePlate: string;
        color: string;
        capacity: number;
    }
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    data: UserData;
    data$ = new Subject<UserData>();
    constructor(private http: HttpClient, private snackbar: SnackbarService) { }

    loadData() {
        // this.data = {
        //     id: -1,
        //     username: 'VashLT',
        //     fullName: 'José Silva',
        //     role: 'driver',
        //     vehicle: {
        //         brand: 'BMW',
        //         model: '2023',
        //         licensePlate: 'LJB-77D',
        //         color: 'negro',
        //         capacity: 4,
        //     }
        // };

        // return;
        this.http.get<UserData>(`${environment.urlBack}/user/data`).subscribe({
            next: (res) => {
                if (!res) return;

                this.data = res;
                this.data$.next(this.data);
            },
            error: (err) => this.snackbar.showBackError(err),
        })
    }

    editUser(body: {
        fullName?: string;
        phoneNumber?: number;
        email?: string;
    }) {
        return this.http.put(`${environment.urlBack}/user`, {...body});
    }

    registerVehicle(body: {
        brand: string;
        model: string;
        licensePlate: string;
        color: string;
        capacity: number;
    }) {
        return this.http.post(`${environment.urlBack}/vehicle/new`, { ...body });
    }
}