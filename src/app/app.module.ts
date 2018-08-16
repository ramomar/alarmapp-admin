import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { App } from './app.component';

import { Vibration } from '@ionic-native/vibration'

import { SettingsPage } from '../pages/settings/settings';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as Sentry from 'sentry-cordova';
import { FloorDiagramCard } from '../components/floor_diagram_card';
import { FloorAreasSummary } from '../components/floor_areas_summary';
import { SummaryCard } from '../components/summary_card';
import { FloorSummaryCard } from '../components/floor_summary_card';
import { FloorSummaryCardIndicator } from '../components/floor_summary_card_indicator';
import { ParticleCloudService } from '../services/ParticleCloudService';
import { AlarmStateService } from '../services/AlarmStateService';
import { AlarmSystemService } from '../services/AlarmSystemService';

import Config from '../config.json';

const particleCloudServiceFactory = () => {
  return new ParticleCloudService(
    Config.PARTICLE_API_HOST,
    Config.PARTICLE_ACCESS_TOKEN,
    Config.PARTICLE_DEVICE_ID
  );
};

const alarmStateServiceFactory = () => {
  return new AlarmStateService();
};

let alarmSystemService;

const alarmSystemServiceFactory = () => {
  if (!alarmSystemService) {
    const alarmSystemBackend = particleCloudServiceFactory();
    const alarmStateBackend = alarmStateServiceFactory();

    alarmSystemService = new AlarmSystemService(
      alarmSystemBackend,
      alarmStateBackend
    );
  }

  return alarmSystemService;
};

Sentry.init({ dsn: Config.SENTRY_DSN });

class SentryIonicErrorHandler extends IonicErrorHandler {
  handleError(error) {
    super.handleError(error);
    try {
      Sentry.captureException(error.originalError || error);
    } catch (e) {
      console.error(e);
    }
  }
}

@NgModule({
  declarations: [
    App,
    SettingsPage,
    HomePage,
    TabsPage,
    FloorDiagramCard,
    FloorAreasSummary,
    SummaryCard,
    FloorSummaryCard,
    FloorSummaryCardIndicator
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(App)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    App,
    SettingsPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Vibration,
    { provide: ErrorHandler, useClass: SentryIonicErrorHandler },
    { provide: AlarmSystemService, useFactory: alarmSystemServiceFactory },
    { provide: ParticleCloudService, useFactory: particleCloudServiceFactory }
  ]
})
export class AppModule {}
