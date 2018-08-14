import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
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
    this.alarmSystemService.start();
  }

  ngOnDestroy(): void {
    this.alarmSystemService.stop();
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
