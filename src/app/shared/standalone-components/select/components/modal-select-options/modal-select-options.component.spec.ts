import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSelectOptionsComponent } from './modal-select-options.component';
import { mockModalControllerProvider } from '__mocks__/providers/modal-controller';

describe('ModalSelectOptionsComponent', () => {
  let component: ModalSelectOptionsComponent;
  let fixture: ComponentFixture<ModalSelectOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalSelectOptionsComponent],
      providers: [mockModalControllerProvider],
    });
    fixture = TestBed.createComponent(ModalSelectOptionsComponent);
    component = fixture.componentInstance;
    component.data = {
      options: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
