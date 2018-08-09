import { Component, Input, OnInit } from '@angular/core';
import {
  AlarmStateService,
  AreaAvailabilityUpdate,
  AreaSummary
} from '../services/AlarmStateService';

@Component({
  selector: 'floor-summary-card-indicator',
  templateUrl: './floor_summary_card_indicator.html'
})
export class FloorSummaryCardIndicator implements OnInit {

  @Input()
  areaSummary: AreaSummary;

  private title: string;
  private content: string;
  private area: number;
  private iconName: string;
  private color: string;

  constructor(private alarmStateService: AlarmStateService) {
    this.alarmStateService
      .availabilityUpdate$
      .filter(update => update.area === this.area)
      .subscribe(update => { this.handleAvailabilityUpdate(update); })
  }

  ngOnInit(): void {
    this.title = `Area ${this.areaSummary.number}`;
    this.content = this.areaSummary.isDisabled ? 'Habilitar': 'Deshabilitar';
    this.iconName = this.areaSummary.isDisabled ? 'eye' : 'eye-off';
    this.color = this.areaSummary.isClosed ? 'secondary' : 'danger';
    this.area = this.areaSummary.number;
  }

  private handleEnableOrDisableAreaIndicatorTap(): void {
    const isDisabled = this.alarmStateService.isDisabled(this.area);

    if (isDisabled) {
      this.alarmStateService.enableArea(this.area);
    } else {
      this.alarmStateService.disableArea(this.area);
    }
  }

  private handleAvailabilityUpdate(update: AreaAvailabilityUpdate): void {
    if (this.iconName === 'eye-off') {
      this.content = 'Habilitar';
      this.iconName = 'eye';
    } else {
      this.content = 'Deshabilitar';
      this.iconName = 'eye-off';
    }
  }
}
