import { Component } from '@angular/core';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styles: [
  `
    ion-router-outlet {
      position: relative;
      height: 100%;
    }
  `
  ]
})
export class WrapperComponent {

}
