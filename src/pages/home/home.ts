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
              private alarmSystemService: AlarmSystemService) {
    this.overviewSegments = 'summarySegment';

    this.isLoading = true;

    this.reconnectRetries = 0;

    this.enableOrDisableSystemButtonIcon = 'eye';

    this.enableOrDisableSystemButtonColor = 'primary';

    this.enableOrDisableSystemButtonText = 'Vigilar';

    alarmSystemService
      .systemStateUpdate$
      .subscribe(isActive => { this.isSystemActive = isActive; });

    alarmSystemService
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

  private handleAlarmStateUpdate(alarmState: AlarmStateSummary): void {
    this.isLoading = false;

    if (alarmState.isSystemActive) {
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
