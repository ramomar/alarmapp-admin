import { Component, Input, OnInit } from '@angular/core';
import {
  AlarmStateService,
  AlarmStateSummary,
  AreaSummary
} from '../services/AlarmStateService';

@Component({
  selector: 'floor-summary-card',
  templateUrl: './floor_summary_card.html'
})
export class FloorSummaryCard implements OnInit {

  @Input()
  cardTitle: string;

  @Input()
  floorNumberString: string;

  private floorNumber: number;

  private openAreasCount: number;

  private disabledAreasCount: number;

  private areaSummaries: Array<AreaSummary>;

  constructor(private alarmStateService: AlarmStateService) {
    this.areaSummaries = [];

    this.alarmStateService = alarmStateService;
  }

  ngOnInit(): void {
    this.floorNumber = parseInt(this.floorNumberString, 10);

    this.alarmStateService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update) });

    this.alarmStateService
      .availabilityUpdate$
      .subscribe(update => { this.updateDisabledAreasCount(); });
  }

  private handleAlarmStateUpdate(alarmStateSummary: AlarmStateSummary): void {
    const areas = alarmStateSummary.getAreasForFloor(this.floorNumber);

    this.openAreasCount = areas.filter(a => !a.isClosed).length;

    this.updateDisabledAreasCount();

    this.areaSummaries = areas;
  }

  private updateDisabledAreasCount(): void {
    this.disabledAreasCount = this.alarmStateService
      .getDisabledAreasCountForFloor(this.floorNumber);
  }
}
