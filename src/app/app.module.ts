import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { App } from './app.component';

import { SettingsPage } from '../pages/settings/settings';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FloorDiagramCard } from '../components/floor_diagram_card';
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

const alarmSystemServiceFactory = () => {
  const alarmSystemBackend = particleCloudServiceFactory();
  const alarmStateBackend = alarmStateServiceFactory();

  return new AlarmSystemService(
    alarmSystemBackend,
    alarmStateBackend
  );
};

@NgModule({
  declarations: [
    App,
    SettingsPage,
    HomePage,
    TabsPage,
    FloorDiagramCard,
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
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: AlarmSystemService, useFactory: alarmSystemServiceFactory }
  ]
})
export class AppModule {}
