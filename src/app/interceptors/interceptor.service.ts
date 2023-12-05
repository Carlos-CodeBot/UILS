import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { finalize, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoaderService } from '../services/loader.service';

@Injectable({
    providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
    constructor(private loader: LoaderService) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        /**
         * blocking loader block interactions in the interface until the request is resolved.
         */
        this.loader.pending.push(true);

        return next.handle(req).pipe(
            retry({ count: 3, delay: this.shouldRetry }),
            finalize(() => {
                this.loader.pending.pop();
            })
        );
    }

    shouldRetry(error: HttpErrorResponse) {
        if (error.status > 500) {
            if (!environment.production) {
                console.log('[INFO] Retrying request', { error });
            }
            return timer(1500);
        }

        throw error;
    }
}
