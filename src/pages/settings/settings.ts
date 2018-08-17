import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AlarmSystemService } from '../../services/AlarmSystemService';
import { NetworkService, NetworkUpdate } from '../../services/NetworkService';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  private isDisconnected: boolean;

  constructor(public navCtrl: NavController,
              private alarmSystemService: AlarmSystemService,
              private platform: Platform,
              private networkService: NetworkService) {
    this.platform.ready().then(() => {
      this.isDisconnected = networkService.isDisconnected();

      this.networkService.networkUpdate$.subscribe(update => {
        this.handleSystemStatusUpdate(update);
      });
    });
  }

  private testSirenButton(): void {
    this.alarmSystemService.testSiren(1000);
  }

  private handleSystemStatusUpdate(statusUpdate: NetworkUpdate) {
    this.isDisconnected = !statusUpdate.isOnline;
  }
}
