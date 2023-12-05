import {
  Component,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DialogActions } from '../../models/dialog-actions.model';
import { AdDirective } from './directives/ad-component/ad-component.directive';
import { DialogHeader } from '../../models/dialog-header.model';
import { DialogArgs } from '../../models/dialog-args.model';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  @Input() header: DialogHeader;
  @Input() actions: DialogActions;
  @Input() type: DialogArgs['type'];
  @Input() maxHeight = '90vh';
  @Input() minWidth = '280px';
  @Input() maxWidth = '600px';
  @Input() width = '90%';
  @Input() cssClass = '';
  @Input() component;
  @Input() content;
  @Input() contentAlignment;
  @Input() data: DialogArgs['data'];

  /**
   * Directiva para injectar los componentes.
   */
  @ViewChild(AdDirective, { static: true })
  adHost!: AdDirective;

  /**
   * Referencia al componente interior.
   */
  componentRef!: ComponentRef<any>;

  constructor(public dialogCtrl: ModalController) {}

  ngOnInit(): void {
    if (this.adHost && this.component) {
      const viewContainerRef = this.adHost.viewContainerRef;
      /**
       * Limpia la vista
       */
      viewContainerRef.clear();
      /**
       * Crea el componente dado como input
       */
      this.componentRef = viewContainerRef.createComponent(this.component);
      /**
       * Asigna los datos input como un atributo del componente
       */
      this.componentRef.instance.data = this.data;
    }
  }

  action() {
    return this.actions.primary.action(
      this.dialogCtrl,
      this.componentRef?.instance?.extraData
    );
  }

  dismiss() {
    return this.actions.dismiss.action
      ? this.actions.dismiss.action(this.dialogCtrl)
      : this.dialogCtrl.dismiss(null, 'cancel');
  }
}
