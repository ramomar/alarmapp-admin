import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ParticleCloudService } from '../../services/ParticleCloudService';
import { parseAlarmStateMessage } from '../../services/parsing/alarmStateMessageParsing';
import { AlarmStateSummary } from "../../services/parsing/parsing";
import { AlarmStateUpdatesService } from '../../services/AlarmStateUpdatesService';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  private overviewSegments: string;

  private ctaDisabled: boolean;
  private ctaColor: string;
  private ctaIcon: string;
  private ctaLegend: string;

  constructor(public navCtrl: NavController,
              private particleCloudService: ParticleCloudService,
              private alarmStateUpdatesService: AlarmStateUpdatesService) {
    this.overviewSegments = 'summarySegment';

    this.particleCloudService = particleCloudService;

    this.ctaDisabled = true;

    this.ctaColor = 'primary';

    this.ctaIcon = 'eye';

    this.ctaLegend = 'Vigilar';

    alarmStateUpdatesService
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

    this.alarmStateUpdatesService.notifyAlarmStateUpdate(alarmState);
  }

  private handleAlarmStateUpdate(alarmState: AlarmStateSummary): void {
    const systemIsActive = alarmState.systemIsActive;

    this.ctaDisabled = false;

    if (systemIsActive) {
      this.ctaColor = 'danger';
      this.ctaIcon = 'eye-off';
      this.ctaLegend = 'Dejar de vigilar';
    } else {
      this.ctaColor = 'primary';
      this.ctaIcon = 'eye';
      this.ctaLegend = 'Vigilar';
    }
  }
}
