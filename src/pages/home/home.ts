import { AfterViewInit, Component, ContentChildren, OnDestroy, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FloorDiagramCard } from '../../components/floor_diagram_card';
import { AlarmService } from '../../services/AlarmService';
import { parseAlarmStateMessage } from '../../services/parsing/alarmStateMessageParsing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {

  @ContentChildren('firstFloorCard')
  firstFloorCard: FloorDiagramCard;

  @ContentChildren('secondFloorCard')
  secondFloorCard: FloorDiagramCard;

  private overviewSegments: string;

  private alarmService: AlarmService;

  constructor(public navCtrl: NavController,
              alarmService: AlarmService) {
    this.overviewSegments = 'summarySegment';
    this.alarmService = alarmService;
  }

  ngOnInit() {
    this.alarmService.open(msg => console.log(parseAlarmStateMessage(msg)));
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
}
