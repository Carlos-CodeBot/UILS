import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  input: {
    control: FormControl;
    sendAction: () => void;
  };
  constructor() { }
}
