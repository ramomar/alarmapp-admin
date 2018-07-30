import { AfterViewInit, Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
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
export class HomePage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('alarmSummaryCardDeck')
  alarmSummaryCardDeck: AlarmSummaryCardDeck;

  @ViewChild('firstFloorCard')
  firstFloorCard: FloorDiagramCard;

  @ViewChild('secondFloorCard')
  secondFloorCard: FloorDiagramCard;

  private overviewSegments: string;

  private alarmService: AlarmService;

  constructor(public navCtrl: NavController,
              alarmService: AlarmService) {
    this.overviewSegments = 'summarySegment';
    this.alarmService = alarmService;
  }

  ngOnInit() {
    this.alarmService.open((message) => { this.handleAlarmStateMessage(message) });
    this.alarmService.requestAlarmState()
      .then(console.log)
      .catch(console.log);
  }

  ngAfterViewInit() {
    console.log(this.firstFloorCard);
    console.log(this.secondFloorCard);
  }

  ngOnDestroy() {
    this.alarmService.close();
  }

  private handleAlarmStateMessage(message): void {
    const alarmState = parseAlarmStateMessage(message);

    this.updateViewState(alarmState);
  }

  private updateViewState(alarmState: AlarmStateSummary): void {
    console.log(this);
    this.alarmSummaryCardDeck.updateViewState(alarmState);
  }
}
