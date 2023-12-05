import { Injectable } from '@angular/core';
// import { AnimationController, ModalController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { DialogArgs } from '../../models/dialog-args.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  isOpen = false;
  ref: HTMLIonModalElement;
  actions$: Subject<any>;
  constructor(private dialog: ModalController) {}

  /**
   * Función para mostrar un dialogo
   *
   * @param args Configuración del dialogo
   * @param backdropDismiss Si al darle click/tap fuera del dialogo éste se puede cerrar
   * @param showBackdrop Si muestra el fondo oscurecido
   * @param cssClass Clase(s) de css para darle estilos adicionales al dialogo
   * @returns
   */
  public show(
    args: DialogArgs,
    backdropDismiss = false,
    showBackdrop = true,
    cssClass = 'dialog__container'
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      /** there is a dialog on view */
      if (args.dismissPrevious === true && (await this.dialog.getTop())) {
        await this.dialog.dismiss();
      }

      if (args.actions.primary || args.actions.dismiss) {
        this.actions$ = new Subject();
      }

      this.ref = await this.dialog.create({
        component: DialogComponent,
        componentProps: args,
        backdropDismiss,
        showBackdrop,
        cssClass,
      });

      this.ref.present().then(() => {
        this.isOpen = true;
      });

      this.ref
        .onWillDismiss()
        .then(({ data, role }) =>
          role === 'confirm' ? resolve(data) : resolve(null)
        )
        .catch((err) => reject(err))
        .finally(() => {
          this.isOpen = false;
        });
    });
  }

  /**
   * Cierra un dialogo si hay alguno abierto
   *
   * @returns none
   */
  async close() {
    if (!this.isOpen) return;

    await this.dialog.dismiss(null, 'forced');
  }

  toggleActionState(type: 'primary' | 'dismiss') {
    if (!this.ref.componentProps.actions) return;

    if (type === 'primary') {
      this.ref.componentProps.actions.primary.disabled =
        !this.ref.componentProps.actions.primary.disabled;
    } else {
      this.ref.componentProps.actions.dismiss.disabled =
        !this.ref.componentProps.actions.dismiss.disabled;
    }

    this.actions$.next({
      ...this.ref.componentProps.actions,
    });
  }
}
