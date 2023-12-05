import { Injectable } from '@angular/core';
import { NavController, iosTransitionAnimation } from '@ionic/angular';
import { SubscriptableType } from 'src/app/models/subscriptable-type';

interface GoBackArgs {
  action?: () => void;
  url?: string;
  animation?: string;
  callback?: () => void;
}

interface Action {
  name: SubscriptableType;
  /** Material icon */
  icon: string;
  action: () => void;
  cssClass?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  /** Si debe mostrar el header o no */
  shouldShow: boolean;
  /** Función que se ejecuta cuando el usuario le da click en ir hacía atrás.
   *  La función de ir hacía atrás en el header solo aparece cuando esta función
   *  está definida.
   */
  goBack: () => void;
  actions: {
    primary?: Action;
    secondary?: Action;
    goBack?: () => void;
  };

  largeMode: boolean;

  /**
   * specifics for modules
   */
  gradesHistory: string;
  upgradeApp: string;

  private _title: string | SubscriptableType;

  constructor(private navCtrl: NavController) {}

  get title() {
    return this._title;
  }

  hide() {
    this.shouldShow = false;
  }

  show() {
    this.shouldShow = true;
  }

  setTitle(title: string) {
    this._title = title;
    if (!this.shouldShow) {
      this.show();
    }
  }

  setGoBack(args: GoBackArgs = { animation: 'slide' }) {
    if (!this.actions) {
      this.actions = {};
    }
    if (args?.action) {
      this.actions.goBack = args.action;
    } else {
      this.actions.goBack = () => {
        const config = {
          animation:
            args?.animation === 'slide' ? iosTransitionAnimation : null,
        };
        if (args.url) {
          this.navCtrl.navigateBack(args.url, config);
        } else {
          this.navCtrl.back(config);
        }

        if (args.callback) args.callback();
      };
    }
  }

  removeGoBack() {
    if (!this.actions) return;

    this.actions.goBack = undefined;
  }
}
