import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    defaultOpts: ToastOptions = {
        duration: 5000,
        position: 'top',
        buttons: [
            {
                icon: 'close',
                role: 'cancel',
                side: 'end',
            },
        ],
    };
    constructor(
        private controller: ToastController
    ) { }

    async show(args: {
        message: string;
        type?: 'success' | 'info' | 'warning' | 'error';
        options?: { paddingHeader?: boolean } & ToastOptions;
    }) {
        /** if there is a snackbar on view it dismiss it */
        if (await this.controller.getTop()) {
            this.controller.dismiss();
        }

        if (!args.options) {
            args.options = this.defaultOpts;
        } else {
            args.options = { ...this.defaultOpts, ...args.options };
        }

        const snackbar = await this.controller.create({
            message: args.message,
            color:
                args.type === 'error'
                    ? 'danger'
                    : args.type === 'info'
                        ? 'light'
                        : args.type === 'warning'
                            ? 'warning'
                            : 'success' /** Por defecto es de tipo 'success' */,
            cssClass:
                `toast-app toast--${args.type}` +
                (args.options?.position === 'bottom' ? ' toast--bottom-padding' : ''),
            ...args.options,
        });

        await snackbar.present();

        return snackbar;
    }

    async showBackError(err: HttpErrorResponse, options: ToastOptions = {}) {
        if (!environment.production) {
            console.log('[TEST] showBackError', { err });
        }
        const snackbar = await this.controller.create({
            message: err.error?.message ?? err.message,
            color: 'danger',
            ...this.defaultOpts,
            ...options,
        });

        await snackbar.present();

        return snackbar;
    }
}
