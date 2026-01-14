import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.empatif.launcher',
  appName: 'Empatif Launcher',
  webDir: 'www',
  ios: { contentInset: 'automatic' },
  android: {},
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      showSpinner: false,
      backgroundColor: '-ion-color-primary',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
