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
import { AlarmSummaryCardDeck } from '../components/alarm_summary_card_deck';
import { AlarmService } from '../services/AlarmService';

import Config from '../config.json';

const alarmServiceFactory = () => {
  return new AlarmService(
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
    AlarmSummaryCardDeck
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
    { provide: AlarmService, useFactory: alarmServiceFactory }
  ]
})
export class AppModule {}
