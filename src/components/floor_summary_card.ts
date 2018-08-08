import { Component, Input } from '@angular/core';
import { AlarmStateUpdatesService } from '../services/AlarmStateUpdatesService';
import { AlarmStateSummary, AreaSummary } from '../services/parsing/parsing';
import { AreaAvailabilityService } from '../services/AreaAvailabilityService';

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

  constructor(private alarmStateUpdatesService: AlarmStateUpdatesService,
              private areaAvailabilityService: AreaAvailabilityService) {
    this.areaSummaries = [];

    this.alarmStateUpdatesService = alarmStateUpdatesService;

    this.alarmStateUpdatesService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update) });
  }

  private handleAlarmStateUpdate(alarmStateSummary: AlarmStateSummary): void {
    this.areaSummaries = alarmStateSummary.getAreasForFloor(parseInt(this.floorNumber, 10));
  }
}
