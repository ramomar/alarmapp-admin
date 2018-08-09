import { Component, Input } from '@angular/core';
import {
  AlarmStateService,
  AlarmStateSummary,
  AreaSummary
} from '../services/AlarmStateService';

@Component({
  selector: 'floor-summary-card',
  templateUrl: './floor_summary_card.html'
})
export class FloorSummaryCard {

  @Input()
  cardTitle: string;

  @Input()
  floorNumber: string;

  private areaSummaries: Array<AreaSummary>;

  constructor(private alarmStateService: AlarmStateService) {
    this.areaSummaries = [];

    this.alarmStateService = alarmStateService;

    this.alarmStateService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update) });
  }

  private handleAlarmStateUpdate(alarmStateSummary: AlarmStateSummary): void {
    this.areaSummaries = alarmStateSummary.getAreasForFloor(parseInt(this.floorNumber, 10));
  }
}
