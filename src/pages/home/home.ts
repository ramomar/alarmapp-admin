import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FloorDiagramCard } from '../../components/floor_diagram_card';
import { AlarmService } from '../../services/AlarmService';
import { parseAlarmStateMessage } from '../../services/parsing/alarmStateMessageParsing';
import { AlarmStateSummary } from "../../services/parsing/parsing";
import { AlarmSummaryCardDeck } from "../../components/alarm_summary_card_deck";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  @ViewChild('alarmSummaryCardDeck')
  alarmSummaryCardDeck: AlarmSummaryCardDeck;

  @ViewChild('firstFloorCard')
  firstFloorCard: FloorDiagramCard;

  @ViewChild('secondFloorCard')
  secondFloorCard: FloorDiagramCard;

  private overviewSegments: string;

  private ctaDisabled: boolean;
  private ctaColor: string;
  private ctaIcon: string;
  private ctaLegend: string;

  private alarmService: AlarmService;

  constructor(public navCtrl: NavController,
              alarmService: AlarmService) {
    this.overviewSegments = 'summarySegment';
    this.alarmService = alarmService;
  }

  ngOnInit() {
    this.ctaDisabled = true;
    this.ctaColor = 'primary';
    this.ctaIcon = 'eye';
    this.ctaLegend = 'Vigilar';
    this.alarmService.open(message => { this.handleAlarmStateMessage(message) });
    this.alarmService.requestAlarmState()
      .then(console.log)
      .catch(console.log);
  }

  ngOnDestroy() {
    this.alarmService.close();
  }

  private handleAlarmStateMessage(message): void {
    const alarmState = parseAlarmStateMessage(message);

    this.updateComponentState(alarmState);
  }

  private updateComponentState(alarmState: AlarmStateSummary): void {
    const systemIsActive = alarmState.systemIsActive;

    this.updateCta(systemIsActive);

    this.alarmSummaryCardDeck.updateComponentState(alarmState);

    this.firstFloorCard
      .updateComponentState(alarmState.getAreasForFloor(1), systemIsActive);

    this.secondFloorCard
      .updateComponentState(alarmState.getAreasForFloor(2), systemIsActive);
  }

  private updateCta(systemIsActive: boolean): void {
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
