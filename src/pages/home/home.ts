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

  private enableOrDisableSystemButtonColor: string;

  private enableOrDisableSystemButtonIcon: string;

  private enableOrDisableSystemButtonText: string;

  constructor(public navCtrl: NavController,
              private particleCloudService: ParticleCloudService,
              private alarmStateService: AlarmStateService) {
    this.overviewSegments = 'summarySegment';

    this.particleCloudService = particleCloudService;

    this.isLoading = true;

    this.enableOrDisableSystemButtonColor = 'primary';

    this.enableOrDisableSystemButtonIcon = 'eye';

    this.enableOrDisableSystemButtonText = 'Vigilar';

    alarmStateService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update) });

    this
      .particleCloudService
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

    this.alarmStateService.updateState(alarmState);
  }

  private handleAlarmStateUpdate(alarmState: AlarmStateSummary): void {
    const systemIsActive = alarmState.systemIsActive;

    this.isLoading = false;

    if (systemIsActive) {
      this.enableOrDisableSystemButtonColor = 'danger';
      this.enableOrDisableSystemButtonIcon = 'eye-off';
      this.enableOrDisableSystemButtonText = 'Dejar de vigilar';
    } else {
      this.enableOrDisableSystemButtonColor = 'primary';
      this.enableOrDisableSystemButtonIcon = 'eye';
      this.enableOrDisableSystemButtonText = 'Vigilar';
    }
  }
}
