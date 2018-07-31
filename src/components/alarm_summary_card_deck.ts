import { Component, ViewChild } from '@angular/core';
import { SummaryCardIndicator, SummaryCard } from './summary_card';
import { AlarmStateSummary, AreaSummary } from '../services/parsing/parsing';

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

 updateComponentState(alarmState: AlarmStateSummary): void {
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

    const firstFloorIndicators = alarmState
      .getAreasForFloor(1)
      .map(AlarmSummaryCardDeck.makeIndicator);

    const secondFloorIndicators = alarmState
      .getAreasForFloor(2)
      .map(AlarmSummaryCardDeck.makeIndicator);

    this.generalSummaryCard.updateComponentState(generalIndicators);

    this.firstFloorSummaryCard.updateComponentState(firstFloorIndicators);

    this.secondFloorSummaryCard.updateComponentState(secondFloorIndicators);
  }

  private static makeIndicator(areaSummary: AreaSummary): SummaryCardIndicator {
    return new SummaryCardIndicator(
      `Zona ${areaSummary.areaNumber}`,
      areaSummary.isClosed ? 'Cerrada' : 'Abierta',
      areaSummary.isClosed ? 'secondary' : 'danger'
    );
  }
}
