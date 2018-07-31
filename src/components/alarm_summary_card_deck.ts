import { Component, ViewChild } from '@angular/core';
import { SummaryCardIndicator, SummaryCard } from './summary_card';
import { AlarmStateSummary, AreaSummary, AreaFloorMappings } from '../services/parsing/parsing';

@Component({
  selector: 'alarm-summary-card-deck',
  templateUrl: 'alarm_summary_card_deck.html'
})
export class AlarmSummaryCardDeck {

  @ViewChild('generalSummaryCard')
  private generalSummaryCard: SummaryCard;

  @ViewChild('firstFloorSummaryCard')
  private firstFloorSummaryCard: SummaryCard;

  @ViewChild('secondFloorSummaryCard')
  private secondFloorSummaryCard: SummaryCard;

  constructor() {

  }

 updateViewState(alarmState: AlarmStateSummary): void {
    const generalIndicators = [
      new SummaryCardIndicator(
        'Sistema',
        alarmState.systemIsActive ? 'Activado' : 'Desactivado',
        alarmState.systemIsActive ? 'danger' : 'light'
      ),
      new SummaryCardIndicator(
        'Sirena',
        alarmState.sirenIsActive ? 'Activada' : 'Desactivada',
        alarmState.sirenIsActive ? 'danger': 'light'
      )
    ];

    const firstFloorIndicators = alarmState.areas
      .filter(a => AreaFloorMappings.get(a.areaNumber) === 1)
      .map(this.makeIndicator);

    const secondFloorIndicators = alarmState.areas
      .filter(a => AreaFloorMappings.get(a.areaNumber) === 2)
      .map(this.makeIndicator);

    this.generalSummaryCard.updateViewState(generalIndicators);

    this.firstFloorSummaryCard.updateViewState(firstFloorIndicators);

    this.secondFloorSummaryCard.updateViewState(secondFloorIndicators);
  }

  private static makeIndicator(areaSummary: AreaSummary): SummaryCardIndicator {
    return new SummaryCardIndicator(
      `Zona ${areaSummary.areaNumber}`,
      areaSummary.isClosed ? 'Cerrada' : 'Abierta',
      areaSummary.isClosed ? 'secondary' : 'danger'
    );
  }
}
