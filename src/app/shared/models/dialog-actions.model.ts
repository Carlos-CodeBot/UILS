import { ModalController } from '@ionic/angular';
import { SubscriptableType } from 'src/app/models/subscriptable-type';

export interface DialogActions {
  primary?: {
    name: string | SubscriptableType;
    action: (dialogCtrl: ModalController, extraData?: any) => void;
    disabled?: boolean;
  };
  dismiss?: {
    name: string | SubscriptableType;
    action?: (dialogCtrl: ModalController) => void;
    disabled?: boolean;
  };
}
