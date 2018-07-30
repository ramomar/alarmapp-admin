import { Component, ViewChild } from '@angular/core';
import {SummaryCardIndicator, SummaryCard} from './summary_card';
import {AlarmStateSummary} from '../services/parsing/parsing';

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

    this.generalSummaryCard.updateViewState([].concat(generalIndicators));
  }
}
