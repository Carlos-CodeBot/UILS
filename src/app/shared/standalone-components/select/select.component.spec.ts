import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select.component';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from '../../services/dialog/dialog.service';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let mockDialogService: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectComponent, TranslateModule.forRoot()],
    });
    fixture = TestBed.createComponent(SelectComponent);
    mockDialogService = TestBed.inject(DialogService);
    component = fixture.componentInstance;
    component.config = {
      options: [],
      placeholder: '',
      headerOpts: {},
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showOptions', () => {
    spyOn(mockDialogService, 'show');
    /**
     * no initial option
     */
    component.showOptions();

    expect(mockDialogService.show).toHaveBeenCalled();

    component.config.initialOption = { id: 1, nombre: 'test' };

    /**
     * Option does not exist
     */
    component.showOptions();

    expect(component.currOption).toBeTruthy();
  });

  it('manualSetOption', () => {
    const mockOptions = [
      { id: 0, nombre: 'test' },
      { id: 1, nombre: 'test2' },
    ];
    component.config.options = mockOptions;
    /**
     * Option does not exist
     */
    component.manualSetOption({ id: 5, nombre: 'null' });

    expect(component.currOption).toBeFalsy();

    component.manualSetOption(mockOptions[1]);

    expect(component.currOption).toBe(mockOptions[1]);
  });
});
