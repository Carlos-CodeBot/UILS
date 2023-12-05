import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { DialogService } from './dialog.service';
import { DialogComponent } from '../../components/dialog/dialog.component';

describe('DialogService', () => {
  let service: DialogService;
  let modal: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ModalController,
          useValue: {
            back: () => {},
            create: () => {
              return new Promise((res) => {
                res({
                  present: () => {},
                  onWillDissmiss: () => {},
                });
              });
            },
            dismiss: (_data, _role) =>
              new Promise<boolean>((resolve, _reject) => {
                resolve(true);
              }),
          },
        },
      ],
    });
    service = TestBed.inject(DialogService);
    modal = TestBed.inject(ModalController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    const mockArgs = {
      header: {
        title: 'test',
        icon: 'test',
      },
      content: 'content',
      actions: {},
    };
    it('create dialog with args', fakeAsync(() => {
      spyOn(modal, 'create').and.returnValue(
        new Promise<any>((res, _) => {
          res({
            present: () => new Promise((resolve, _rej) => resolve(null)),
            onWillDismiss: () =>
              new Promise<any>((resolve, _rej) => {
                setTimeout(() => {
                  resolve({
                    data: true,
                    role: '',
                  });
                }, 600);
              }),
          });
        })
      );
      const promise = service.show(mockArgs);
      expect(promise).toBeTruthy();

      tick(501);
      expect(modal.create).toHaveBeenCalledWith({
        component: DialogComponent,
        componentProps: mockArgs,
        backdropDismiss: false,
        showBackdrop: true,
        cssClass: 'dialog__container',
      });
      expect(service.isOpen).toBe(true);

      tick(301);
      expect(service.isOpen).toBe(false);
    }));
  });

  describe('close', () => {
    it('dialog is open', fakeAsync(() => {
      spyOn(modal, 'dismiss');
      service.isOpen = true;
      service.close();

      tick(501);
      expect(modal.dismiss).toHaveBeenCalledWith(null, 'forced');
    }));
    it('dialog is closed', fakeAsync(() => {
      let output;
      const promise = service.close();

      promise.then((res) => {
        output = res;
      });

      tick(501);
      expect(output).toBe(undefined);
    }));
  });
});
