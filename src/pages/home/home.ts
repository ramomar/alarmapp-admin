import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ParticleCloudService } from '../../services/ParticleCloudService';
import { parseAlarmStateMessage } from '../../services/parsing/alarmStateMessageParsing';
import {
  AlarmStateService,
  AlarmStateSummary
} from '../../services/AlarmStateService';

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
              private particleCloudService: ParticleCloudService,
              private alarmStateService: AlarmStateService) {
    this.overviewSegments = 'summarySegment';

    this.isLoading = true;

    this.enableOrDisableSystemButtonIcon = 'eye';

    this.enableOrDisableSystemButtonColor = 'primary';

    this.enableOrDisableSystemButtonText = 'Vigilar';

    alarmStateService
      .systemStateUpdate$
      .subscribe(isActive => { this.isSystemActive = isActive; });

    alarmStateService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update) });

    particleCloudService
      .open(message => { this.handleAlarmStateMessage(message) });
  }

  ngOnInit(): void {
    this.particleCloudService
      .requestAlarmState()
      .then(console.log)
      .catch(console.log);
  }

  ngOnDestroy(): void {
    this.particleCloudService.close();
  }

  private handleAlarmStateMessage(message): void {
    const alarmState = parseAlarmStateMessage(message);

    if (alarmState.systemIsActive) {
      this.alarmStateService.activateSystem();
    } else {
      this.alarmStateService.deactivateSystem();
    }

    this.alarmStateService.updateState(alarmState);
  }

  private handleAlarmStateUpdate(alarmState: AlarmStateSummary): void {
    this.isLoading = false;

    if (this.isSystemActive) {
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
