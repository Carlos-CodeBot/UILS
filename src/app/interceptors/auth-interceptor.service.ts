import { Injectable, OnDestroy } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import {
    catchError,
    delay,
    Observable,
    of,
    Subject,
    Subscription,
    takeUntil,
    throwError,
} from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor, OnDestroy {
    logoutSub: Subscription;
    actionsSub: Subscription;
    idUsuario: number;

    private logout$ = new Subject<void>();

    private tokenSub = new Subscription();

    constructor(
        private jwtHelper: JwtHelperService,
        private auth: AuthService,
        private router: Router
    ) {
        this.logoutSub = this.auth.logout$.subscribe((_value) => {
            this.idUsuario = undefined;
            this.logout$.next();
            this.logout$.complete();
            this.logout$ = new Subject<void>();
        })
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('authToken');

        let headers = req.headers
        
        console.log({ token, url: req.url });
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`)
        }

        if (token && !this.idUsuario) {
            this.idUsuario = this.jwtHelper.decodeToken(token).id;
        }

        if (this.idUsuario) {
            headers = headers.set('idusuario', String(this.idUsuario));
        }

        return next.handle(req.clone({ headers })).pipe(
            takeUntil(this.logout$),
            catchError((err: HttpErrorResponse) => {
                if (
                    this.router.routerState.snapshot.url.includes('auth')
                ) {
                    return throwError(() => err);
                }

                if (
                    (err.status === 401 || err.status === 403) &&
                    !req.url.endsWith('login')
                ) {
                    this.auth.logout();
                    throw new Error('Invalid request');
                }
                return throwError(() => err);
            })
        );
    }

    expirationCounter(timeout) {
        this.tokenSub.unsubscribe();
        this.tokenSub = of(null)
            .pipe(delay(timeout))
            .subscribe(() => {
                this.auth.logout();
            });
    }

    ngOnDestroy(): void {
        this.logoutSub?.unsubscribe();
        this.tokenSub?.unsubscribe();
        this.actionsSub?.unsubscribe();
        this.idUsuario = undefined;
    }
}
