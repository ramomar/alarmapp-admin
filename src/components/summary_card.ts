import { Component, Input } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AlarmStateSummary, AlarmSystemService } from '../services/AlarmSystemService';
import { NetworkService } from '../services/NetworkService';

@Component({
  selector: 'summary-card',
  templateUrl: './summary_card.html'
})
export class SummaryCard {

  @Input()
  cardTitle: string;

  private indicators: Array<SummaryCardIndicator>;

  private isDisconnected: boolean;

  constructor(private alarmSystemService: AlarmSystemService,
              private platform: Platform,
              private networkService: NetworkService) {
    this.indicators = [];

    this.alarmSystemService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update) });

    this.networkService.networkUpdate$.subscribe(update => {
      this.isDisconnected = !update.isOnline;
    });

    this.platform.ready().then(() => {
      this.isDisconnected = networkService.isDisconnected();
    });
  }

  private handleAlarmStateUpdate(alarmStateSummary: AlarmStateSummary): void {
    this.indicators = [
      new SummaryCardIndicator(
        'Sistema',
        alarmStateSummary.isSystemActive ? 'Activado' : 'Desactivado',
        alarmStateSummary.isSystemActive ? 'danger' : 'light'
      ),
      new SummaryCardIndicator(
        'Sirena',
        alarmStateSummary.isSirenActive ? 'Encendida' : 'Apagada',
        alarmStateSummary.isSirenActive ? 'danger': 'light'
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
