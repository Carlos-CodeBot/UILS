import { Component, Input } from "@angular/core";

@Component({
    selector: "app-modal-view-trip",
    template: `
    <ion-text>
        <strong>Lugar de salida: </strong>
        {{ data.trip.startingPlace | sentenceCase }}</ion-text>
        <ion-text><strong>Paradas: </strong></ion-text>
        <ul>
            <ng-container *ngFor="let stop of data.trip.dirRoutes">
                <li *ngIf="stop">{{ stop }}</li>
            </ng-container>
        </ul>
        <ion-text><strong>Asientos disponibles: </strong> {{ data.trip.availableSeats }}</ion-text>
        <ion-text><strong>Vehiculo: </strong> {{ data.trip.vehicle.brand }} -
            {{ data.trip.vehicle.model }}</ion-text>
        <ion-text class="price"><strong>Precio: </strong> {{ data.trip.price }} COP</ion-text>
    
    `,
    styles: [`
        :host ul {
            margin: 0;
        }
    
        :host ion-text {
            display: block;
        }

        :host ion-text.price {
            margin-top: 16px;
            font-size: 16px;
            color: var(--ion-color-tertiary);
        }

        :host ion-text.price strong {
            color: var(--ion-color-tertiary);
        }
    `],
})
export class ModalViewTripComponent {
    @Input() data;
}