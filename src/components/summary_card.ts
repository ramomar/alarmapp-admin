import { Component, Input } from '@angular/core';

@Component({
  selector: 'summary-card',
  templateUrl: './summary_card.html'
})
export class SummaryCard {

  @Input()
  cardTitle: string;

  constructor() {

  }
}
