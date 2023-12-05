import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectListComponent } from '../../../select-list/select-list.component';
import { CommonModule } from '@angular/common';
import { Option } from 'src/app/shared/standalone-components/select-list/models/select-list-option.model';
import { Option as SelectOption } from 'src/app/shared/standalone-components/select/models/select-option.model';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';

@Component({
  selector: 'app-modal-select-options',
  template: `<app-select-list
    [control]="control"
    [options]="opts"
    (selectChange)="onOptionSelect($event)"
  />`,
  styles: [
    `
      :host app-select-list {
        display: block;
        max-height: 50vh;
        overflow-y: auto;
      }

      :host::before {
        display: block;
        content: '';
        width: 100%;
        height: 1px;
        background-color: var(--color-divider);
        margin-bottom: 8px;
      }

      :host::after {
        display: block;
        content: '';
        width: 100%;
        height: 1px;
        background-color: var(--color-divider);
        margin-top: 8px;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, SelectListComponent],
})
export class ModalSelectOptionsComponent implements OnInit {
  @Input() data: {
    options: SelectOption[];
    currOptionId?: any;
  };
  /**
   * if user has chosen an option at least once
   */
  didSelect = false;
  /**
   * define here the value that is going to be returned by this component through the modal
   */
  extraData: any;
  public control: FormControl;
  public opts: Option[];

  constructor(private dialog: DialogService) {}

  ngOnInit(): void {
    this.didSelect = this.data.currOptionId !== undefined;
    this.opts = this.data.options.map((option) => ({
      value: option.id,
      translation: option.nombre,
      selected: this.data.currOptionId === option.id,
    }));

    this.control = new FormControl();
  }

  onOptionSelect(id: number) {
    if (id === this.data.currOptionId) return;
    if (!this.didSelect) {
      this.didSelect = true;
      this.dialog.toggleActionState('primary');
    }

    this.extraData = id;
  }
}
