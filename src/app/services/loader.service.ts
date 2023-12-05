import { Injectable } from '@angular/core';

/**
 * Servicio para mostrar loaders
 *
 * @export
 * @class LoaderService
 */
@Injectable({
    providedIn: 'root',
})
export class LoaderService {
    pending: (boolean | 'blocking')[] = [];
    constructor() { }
}
