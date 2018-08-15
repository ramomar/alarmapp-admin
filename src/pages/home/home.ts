import { Vibration } from '@ionic-native/vibration';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { AlarmStateSummary, AlarmSystemService } from '../../services/AlarmSystemService';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  private overviewSegments: string;

  private isLoading: boolean;

  private reconnectRetries: number;

  private isSystemActive: boolean;

  private enableOrDisableSystemButtonIcon: string;

  private enableOrDisableSystemButtonText: string;

  private enableOrDisableSystemButtonColor: string;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private alarmSystemService: AlarmSystemService,
              private vibration: Vibration) {
    this.overviewSegments = 'summarySegment';

    this.isLoading = true;

    this.reconnectRetries = 0;

    this.enableOrDisableSystemButtonIcon = 'eye';

    this.enableOrDisableSystemButtonColor = 'primary';

    this.enableOrDisableSystemButtonText = 'Vigilar';

    this.alarmSystemService
      .systemStateUpdate$
      .subscribe(systemStateUpdate => { this.handleSystemStateUpdate(systemStateUpdate); });

    this.alarmSystemService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update) });
  }

  ngOnInit(): void {
    this.alarmSystemService.start(e => { this.onError(e); });
  }

  ngOnDestroy(): void {
    this.alarmSystemService.stop();
  }

  private onError(error) {
    console.log(error);

    const retry = () => {
      this.alarmSystemService.start(e => { this.onError(e) });

      this.reconnectRetries += 1;
    };

    this.presentConnectRetry(retry);

    if (this.reconnectRetries === 3) {
      throw error;
    }
  }

  private presentConnectRetry(retryHandler): void {
    const alertOptions = {
      title: '¡Uy!',
      message: 'Alarmapp esta teniendo problemas para contectarse.',
      buttons: [
        { text: 'Reintentar', handler: retryHandler }
      ],
      enableBackdropDismiss: false
    };

    const alert = this.alertCtrl.create(alertOptions);

    alert.present();
  }

  private activateSystemButton() {
    if (this.isSystemActive) {
      this.alarmSystemService.deactivateSystem();
    } else {
      this.alarmSystemService.activateSystem();
    }
  }

  private handleSystemStateUpdate(systemStateUpdate: boolean): void {
    this.isSystemActive = systemStateUpdate;

    if (systemStateUpdate) {
      this.vibration.vibrate(200);
    }

    this.updateEnableOrDisableSystemButton(systemStateUpdate);
  }

  private handleAlarmStateUpdate(alarmState: AlarmStateSummary): void {
    this.isLoading = false;

    this.updateEnableOrDisableSystemButton(alarmState.isSystemActive);
  }

  private updateEnableOrDisableSystemButton(isSystemActive: boolean): void {
    if (isSystemActive) {
      this.enableOrDisableSystemButtonIcon = 'eye-off';
      this.enableOrDisableSystemButtonText = 'Dejar de vigilar';
      this.enableOrDisableSystemButtonColor = 'danger';
    } else {
      this.enableOrDisableSystemButtonIcon = 'eye';
      this.enableOrDisableSystemButtonText = 'Vigilar';
      this.enableOrDisableSystemButtonColor = 'primary';
    }
  }
}
