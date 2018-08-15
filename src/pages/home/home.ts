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

  private isSystemActive: boolean;

  private enableOrDisableSystemButtonIcon: string;

  private enableOrDisableSystemButtonText: string;

  private enableOrDisableSystemButtonColor: string;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private alarmSystemService: AlarmSystemService) {
    this.overviewSegments = 'summarySegment';

    this.isLoading = true;

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
    const retry = () => { this.alarmSystemService.start(e => { this.onError(e) }); };
    const report = () => {
      console.log(error);
      this.pleaseCloseTheApp();
    };

    this.presentConnectRetry(retry, report);
  }

  private presentConnectRetry(retryHandler, reportHandler): void {
    const alertOptions = {
      title: 'Oops',
      message: 'Alarmapp está teniendo problemas para conectarse.',
      buttons: [
        {
          text: 'Reportar',
          handler: reportHandler
        },
        {
          text: 'Reintentar',
          handler: retryHandler
        }
      ]
    };

    const alert = this.alertCtrl.create(alertOptions);

    alert.present();
  }

  private pleaseCloseTheApp(): void {
    const alertOptions = {
      title: 'Error reportado',
      message: 'Por favor cierra la aplicación.',
      buttons: ['Ok']
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
