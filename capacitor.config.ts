import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.uis.uils',
  appName: 'UILS',
  webDir: 'dist/UILS',
  server: {
    androidScheme: 'http'
  },
  plugins: {
    SplashScreen: {
      backgroundColor: '#000000',
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
      launchShowDuration: 2000,
    },
    Keyboard: {
      resizeOnFullScreen: true,
      resize: KeyboardResize.Body,
    },
  }
};

export default config;
