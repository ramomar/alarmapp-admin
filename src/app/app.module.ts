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
import { ParticleCloudService } from '../services/ParticleCloudService';
import { AreaAvailabilityService } from '../services/AreaAvailabilityService';
import { FloorSummaryCardIndicator } from '../components/floor_summary_card_indicator';

import Config from '../config.json';
import { AlarmStateUpdatesService } from '../services/AlarmStateUpdatesService';

const particleCloudServiceFactory = () => {
  return new ParticleCloudService(
    Config.PARTICLE_API_HOST,
    Config.PARTICLE_ACCESS_TOKEN,
    Config.PARTICLE_EVENT_PREFIX,
    Config.PARTICLE_DEVICE_ID
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
    { provide: ParticleCloudService, useFactory: particleCloudServiceFactory },
    AlarmStateUpdatesService,
    AreaAvailabilityService
  ]
})
export class AppModule {}
