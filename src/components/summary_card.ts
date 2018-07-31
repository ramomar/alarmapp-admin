import { Component, Input } from '@angular/core';

@Component({
  selector: 'summary-card',
  templateUrl: './summary_card.html'
})
export class SummaryCard {

  @Input()
  cardTitle: string;

  private indicators: Array<SummaryCardIndicator>;

  constructor() {
    this.indicators = [];
  }

  updateComponentState(indicators: Array<SummaryCardIndicator>) {
    this.indicators = indicators;
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
