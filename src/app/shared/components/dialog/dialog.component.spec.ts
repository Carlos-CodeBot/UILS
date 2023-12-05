import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';

import { DialogComponent } from './dialog.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogComponent],
      imports: [PipesModule, TranslateModule.forRoot()],
      providers: [{ provide: ModalController, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.actions = {
      primary: {
        name: 'PRIMARY',
        action: () => {},
      },
      dismiss: {
        name: 'DISMISS',
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
