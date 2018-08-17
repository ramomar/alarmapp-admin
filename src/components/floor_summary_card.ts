import { Component, Input, OnInit } from '@angular/core';
import {
  AlarmSystemService,
  AlarmStateSummary,
  AreaSummary
} from '../services/AlarmSystemService';

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

  constructor(private alarmSystemService: AlarmSystemService) {
    this.areaSummaries = [];

    this.alarmSystemService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update) });

    this.alarmSystemService
      .availabilityUpdate$
      .subscribe(() => { this.updateDisabledAreasCount(); });
  }

  ngOnInit(): void {
    this.floorNumber = parseInt(this.floorNumberString, 10);
  }

  private handleAlarmStateUpdate(alarmStateSummary: AlarmStateSummary): void {
    const areas = alarmStateSummary.getAreasForFloor(this.floorNumber);

    this.openAreasCount = areas.filter(a => !a.isClosed).length;

    this.updateDisabledAreasCount();

    // No problem. It's easier to just re-render indicators.
    this.areaSummaries = areas;
  }

  private updateDisabledAreasCount(): void {
    this.disabledAreasCount = this.alarmSystemService
      .getDisabledAreasCountForFloor(this.floorNumber);
  }
}
