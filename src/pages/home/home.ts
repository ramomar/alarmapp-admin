import { Component, OnDestroy } from '@angular/core';
import { AlertController, NavController, Platform } from 'ionic-angular';
import { AlarmStateSummary, AlarmSystemService } from '../../services/AlarmSystemService';
import { NetworkService, NetworkUpdate } from '../../services/NetworkService';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnDestroy {

  private overviewSegments: string;

  private isLoading: boolean;

  private isDisconnected: boolean;

  private reconnectRetries: number;

  private isSystemActive: boolean;

  private activateOrDeactivateSystemButtonIcon: string;

  private activateOrDeactivateSystemButtonText: string;

  private activateOrDeactivateSystemButtonColor: string;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private alarmSystemService: AlarmSystemService,
              private platform: Platform,
              private networkService: NetworkService) {
    this.overviewSegments = 'summarySegment';

    this.isLoading = true;

    this.reconnectRetries = 0;

    this.activateOrDeactivateSystemButtonIcon = 'eye';

    this.activateOrDeactivateSystemButtonColor = 'primary';

    this.activateOrDeactivateSystemButtonText = 'Vigilar';

    this.networkService.networkUpdate$.subscribe(update => {
      this.handleSystemStatusUpdate(update);
    });

    this.alarmSystemService
      .systemStatusUpdate$
      .subscribe(systemStateUpdate => { this.handleSystemStateUpdate(systemStateUpdate); });

    this.alarmSystemService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update) });

    this.platform.ready().then(() => {
      this.isDisconnected = this.networkService.isDisconnected();

      if (!this.isDisconnected) {
        this.alarmSystemService.start().catch(e => {
          this.onConnectionError(e);
        });
      } else {
        this.presentOfflineAlert();
      }
    });
  }

  ngOnDestroy(): void {
    this.alarmSystemService.stop();
  }

  private presentConnectRetryAlert(): void {
    const alertOptions = {
      title: '¡Uy!',
      message: 'Alarmapp esta teniendo problemas para contectarse. ' +
      'Revisa tu conexión a la red y luego prueba refrescar la aplicación.',
      buttons: [
        { text: 'De acuerdo' }
      ]
    };

    const alert = this.alertCtrl.create(alertOptions);

    alert.present();
  }

  private presentOfflineAlert(): void {
    const alertOptions = {
      title: '¡Uy!',
      message: 'Parece que te quedaste sin conexión a la red. Prueba conectarte a la red.',
      buttons: [ 'De acuerdo' ]
    };

    const alert = this.alertCtrl.create(alertOptions);

    alert.present();
  }

  private onConnectionError(error) {
    this.reconnectRetries += 1;

    this.presentConnectRetryAlert();

    if (this.reconnectRetries === 3) {
      throw error;
    }
  }

  private doRefresh(refresher): void {
    this.alarmSystemService
      .start()
      .then(() => {
      refresher.complete();
      },
         e => {
      refresher.complete();
      this.onConnectionError(e);
    });
  }

  private activateSystemButton(): void {
    if (this.isSystemActive) {
      this.alarmSystemService.deactivateSystem();
    } else {
      this.alarmSystemService.activateSystem();
    }
  }

  private handleSystemStatusUpdate(statusUpdate: NetworkUpdate) {
    if (statusUpdate.isOnline) {
      this.alarmSystemService.start()
        .catch(e => { this.onConnectionError(e) });
    } else {
      this.presentOfflineAlert();
    }

    this.isDisconnected = !statusUpdate.isOnline;
  }

  private handleSystemStateUpdate(systemStateUpdate: boolean): void {
    this.isSystemActive = systemStateUpdate;

    this.updateActivateOrDeactivateSystemButton(systemStateUpdate);
  }

  private handleAlarmStateUpdate(alarmState: AlarmStateSummary): void {
    this.isLoading = false;

    this.updateActivateOrDeactivateSystemButton(alarmState.isSystemActive);
  }

  private updateActivateOrDeactivateSystemButton(isSystemActive: boolean): void {
    if (isSystemActive) {
      this.activateOrDeactivateSystemButtonIcon = 'eye-off';
      this.activateOrDeactivateSystemButtonText = 'Dejar de vigilar';
      this.activateOrDeactivateSystemButtonColor = 'danger';
    } else {
      this.activateOrDeactivateSystemButtonIcon = 'eye';
      this.activateOrDeactivateSystemButtonText = 'Vigilar';
      this.activateOrDeactivateSystemButtonColor = 'primary';
    }
  }
}
