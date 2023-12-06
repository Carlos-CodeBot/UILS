import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { HeaderService } from "../shared/components/header/service/header.service";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    logout$ = new Subject();
    constructor(
        private http: HttpClient,
        private router: Router,
        private header: HeaderService
    ) { }

    login(body: {
        username: string;
        password: string;
    }) {
    return this.http.post<{ token: string }>(`${environment.urlBack}/auth/login`, { ...body })
    }

    signup(body: {
        username: string;
        password: string;
        fullName: string;
        phoneNumber: string;
        email: string;
        role: 'driver' | 'passenger'
    }) {
        // return of({ token: 'long_string' });
        return this.http.post<{ token: string }>(`${environment.urlBack}/auth/signup`, { ...body })
    }

    checkNameExists(username) {
        return this.http.get<boolean>(
            `${environment.urlBack}/public/user/checkUser?username=${username}`,
            {
                withCredentials: true,
            }
         );
    }

    logout() {
        localStorage.clear();
        this.header.actions = null;
        this.logout$.next(true);
        this.router.navigateByUrl('auth');
    }
}