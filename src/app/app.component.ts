import { Component } from '@angular/core';
import { LoaderService } from './services/loader.service';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { ON_WEB } from './constants/platform';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    public loader: LoaderService
  ) { 
    if (ON_WEB) return;
    this.platform.ready().then(async () => {
      /** funcionalidad especifica de dispositivos */

      setTimeout(() => {
        SplashScreen.hide();
      }, 1000);

      /** block screen orientation */
      await ScreenOrientation.lock({
        orientation: 'portrait',
      });

    });
  }
}
