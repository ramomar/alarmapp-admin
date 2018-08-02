import { Component, Input } from '@angular/core';
import { AlarmStateUpdatesService } from '../services/AlarmStateUpdatesService';
import { AlarmStateSummary, AreaSummary } from '../services/parsing/parsing';

@Component({
  selector: 'floor-summary-card',
  templateUrl: './floor_summary_card.html'
})
export class FloorSummaryCard {

  @Input()
  cardTitle: string;

  @Input()
  floorNumber: string;

  private indicators: Array<FloorSummaryCardIndicator>;

  constructor(private alarmStateUpdatesService: AlarmStateUpdatesService) {
    this.indicators = [];

    this.alarmStateUpdatesService = alarmStateUpdatesService;

    this.alarmStateUpdatesService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update) });
  }

  private handleAlarmStateUpdate(alarmStateSummary: AlarmStateSummary): void {
    this.indicators = alarmStateSummary
      .getAreasForFloor(parseInt(this.floorNumber, 10))
      .map(FloorSummaryCard.makeIndicator);
  }

  private static makeIndicator(areaSummary: AreaSummary): FloorSummaryCardIndicator {
    return new FloorSummaryCardIndicator(
      `Zona ${areaSummary.areaNumber}`,
      areaSummary.isClosed ? 'Cerrada' : 'Abierta',
      areaSummary.isClosed ? 'secondary' : 'danger'
    );
  }
}

export class FloorSummaryCardIndicator {
  readonly title: string;
  readonly content: string;
  readonly color: string;

  constructor(title: string,
              content: string,
              color: string) {
    this.title = title;
    this.content = content;
    this.color = color;
  }
}