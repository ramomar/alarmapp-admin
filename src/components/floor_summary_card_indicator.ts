import { Component, Input, OnInit } from '@angular/core';
import {
  AreaAvailabilityService,
  AreaAvailabilityUpdate
} from '../services/AreaAvailabilityService';
import { AreaSummary } from '../services/parsing/parsing';

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

  constructor(private areaAvailabilityService: AreaAvailabilityService) {
    this.areaAvailabilityService
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
    const isDisabled = this.areaAvailabilityService.isDisabled(this.area);

    if (isDisabled) {
      this.areaAvailabilityService.enableArea(this.area);
    } else {
      this.areaAvailabilityService.disableArea(this.area);
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
