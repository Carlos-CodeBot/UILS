import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Option } from './models/select-list-option.model';

@Component({
  selector: 'app-select-list',
  template: `
    <div *ngFor="let option of options" (click)="select(option)">
      <span [class]="option.value === control.value ? 'selected' : ''"></span>
      <p>{{ option.translation }}</p>
    </div>
  `,
  styles: [
    `
      :host {
        --size-box: 20px;
        --padding-start: 16px;
      }

      :host div {
        height: 48px;
        display: flex;
        align-items: center;
        padding: 8px 0;
        padding-left: var(--padding-start);
      }

      :host span {
        position: relative;
        border-radius: 50%;
        border: 2px solid var(--color-on-surface);
        width: var(--size-box);
        height: var(--size-box);
        transition: border-color 0.2s ease;
        margin-right: 16px;
        padding: 8px;
      }

      :host span::after {
        content: '';
        height: calc(var(--size-box) - 10px);
        width: calc(var(--size-box) - 10px);
        top: 50%;
        left: 50%;
        position: absolute;
        border-radius: 50%;
        background-color: var(--ion-color-primary);
        display: block;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.2s ease;
        transform-origin: center;
      }

      :host span.selected {
        border-color: var(--ion-color-primary);
      }
      :host span.selected::after {
        transform: translate(-50%, -50%) scale(1);
      }

      :host p {
        margin: 0;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule],
})
export class SelectListComponent implements OnInit {
  @Input({ required: true }) control: UntypedFormControl;
  @Input({ required: true }) options: Option[];

  @Output() selectChange: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.options.forEach((opt) => {
      if (opt.selected) {
        this.control.setValue(opt.value);
      }
    });
  }

  select(opt: Option) {
    if (this.control.value === opt.value) return;
    this.control.setValue(opt.value);
    this.selectChange.emit(opt.value);
  }
}
