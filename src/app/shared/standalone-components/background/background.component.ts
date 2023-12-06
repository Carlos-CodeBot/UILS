import { Component } from "@angular/core";

@Component({
    selector: 'app-background',
    template: `
    <div class="square rotated"></div>
    <div class="triangle"></div>
    <div class="circle"></div>
    <div class="square"></div>
    `,
    styles: [`
        :host {
            --background: rgba(var(--ion-color-tertiary-rgb), 0.2);
            --size: 48px;
            position: fixed;
            width: 100%;
            height: 300px;
            z-index: -1;
        }

        :host div {
            position: absolute;
        }

        :host .square {
            background-color: var(--background);
            width: var(--size);
            height: var(--size);
        }

        :host .square.rotated {
            transform: rotate(45deg);
        }

        :host .circle {
            background-color: var(--background);
            width: var(--size);
            height: var(--size);
            left: 60%;
            top: 50%;
            transform: translate(-50%, -50%);
        }

        :host .triangle {
            width: 0;
            height: 0;
            border-top: calc(var(--size) * 0.5) solid transparent;
            border-right: var(--size) solid var(--background);
            border-bottom: calc(var(--size) * 0.5) solid transparent;
        }
    
    `],
    standalone: true,
})
export class BackgroundComponent {

}