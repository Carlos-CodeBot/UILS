import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogService } from '../../services/dialog/dialog.service';
import { ModalSelectOptionsComponent } from './components/modal-select-options/modal-select-options.component';
import { IonicModule } from '@ionic/angular';
import { SelectArgs } from './models/select-args.model';
import { Option } from './models/select-option.model';

@Component({
  selector: 'app-select',
  template: `
    <div (click)="showOptions()" [class]="disabled ? 'select-disabled' : ''">
      {{ currOption ? currOption.nombre : config.placeholder }}
      <i class="material-icons">arrow_drop_down</i>
      <ion-ripple-effect></ion-ripple-effect>
    </div>
    <ng-container *ngIf="config.helperText">
      <sub [class]="disabled ? 'select-disabled' : ''">{{
        config.helperText
      }}</sub>
    </ng-container>
  `,
  styles: [
    `
      :host {
        width: 100%;
        display: block;
      }

      :host div {
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        align-self: stretch;
        width: 100%;
        border-radius: 4px;
        padding: 0 16px;
        background-color: var(--color-text-field);
        color: var(--color-on-text-field);
        font-family: var(--ion-font-family-medium);
        font-size: 16px;
        line-height: 24px;
      }

      :host .select-disabled {
        pointer-events: none;
        color: var(--color-inactive-state);
      }

      :host sub {
        margin-top: 4px;
        padding: 0 16px;
        font-size: 12px;
        line-height: 16px;
        font-family: var(--ion-font-family);
        letter-spacing: 0.4px;
        color: var(--color-neutral-text);
      }
    `,
  ],
  standalone: true,
  imports: [
    CommonModule,
    ModalSelectOptionsComponent,
    IonicModule,
  ],
})
export class SelectComponent implements OnInit {
  @Input({ required: true }) config: SelectArgs;
  @Input() disabled: boolean;
  @Output() selectChange: EventEmitter<any> = new EventEmitter();

  currOption: Option;

  constructor(private dialog: DialogService) {}

  ngOnInit() {
    if (this.config.initialOption) {
      this.currOption = this.config.initialOption;
    }
  }

  showOptions() {
    if (this.config.initialOption && !this.currOption) {
      this.currOption = this.config.initialOption;
    }

    this.dialog.show(
      {
        header: this.config.headerOpts,
        component: ModalSelectOptionsComponent,
        data: {
          options: this.config.options,
          currOptionId: this.currOption?.id,
        },
        actions: {
          primary: {
            name: 'Aceptar',
            action: (ref, optionId) => {
              if (optionId && optionId !== this.currOption?.id) {
                this.selectChange.emit(optionId);
                this.currOption = this.config.options.find(
                  ({ id }) => id === optionId
                );
              }

              ref.dismiss();
            },
            disabled: !this.currOption,
          },
          dismiss: {
            name: 'Cancelar',
          },
        },
      },
      true
    );
  }

  manualSetOption(option: Option) {
    console.log({ option });
    if (!this.config.options.find(({ id }) => id === option.id)) return;

    this.currOption = option;
  }
}
