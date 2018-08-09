import { Component, Input } from '@angular/core';
import {
  AlarmStateService,
  AlarmStateSummary
} from '../services/AlarmStateService';

@Component({
  selector: 'summary-card',
  templateUrl: './summary_card.html'
})
export class SummaryCard {

  @Input()
  cardTitle: string;

  private indicators: Array<SummaryCardIndicator>;

  constructor(private alarmStateService: AlarmStateService) {
    this.indicators = [];

    this.alarmStateService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update) });
  }

  private handleAlarmStateUpdate(alarmStateSummary: AlarmStateSummary): void {
    this.indicators = [
      new SummaryCardIndicator(
        'Sistema',
        alarmStateSummary.systemIsActive ? 'Activado' : 'Desactivado',
        alarmStateSummary.systemIsActive ? 'primary' : 'light'
      ),
      new SummaryCardIndicator(
        'Sirena',
        alarmStateSummary.sirenIsActive ? 'Encendida' : 'Apagada',
        alarmStateSummary.sirenIsActive ? 'danger': 'light'
      )
    ];
  }
}

export class SummaryCardIndicator {
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
