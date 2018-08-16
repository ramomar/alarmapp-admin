import { Component, Input, OnInit } from '@angular/core';
import {
  AlarmSystemService,
  AreaAvailability,
  AreaSummary
} from '../services/AlarmSystemService';

@Component({
  selector: 'floor-summary-card-indicator',
  templateUrl: './floor_summary_card_indicator.html'
})
export class FloorSummaryCardIndicator implements OnInit {

  @Input()
  areaSummary: AreaSummary;

  private isSystemActive: boolean;

  private title: string;

  private content: string;

  private area: number;

  private iconName: string;

  private color: string;

  constructor(private alarmSystemService: AlarmSystemService) {
    this.isSystemActive = false;

    this.alarmSystemService
      .systemStatusUpdate$
      .subscribe(systemStateUpdate => { this.handleSystemStateUpdate(systemStateUpdate); });

    this.alarmSystemService
      .availabilityUpdate$
      .filter(area => area.number === this.area)
      .subscribe(areaUpdate => { this.handleAvailabilityUpdate(areaUpdate); });
  }

  ngOnInit(): void {
    this.title = `Area ${this.areaSummary.number}`;
    this.content = this.areaSummary.isClosed ? 'Cerrada': 'Abierta';
    this.iconName = this.areaSummary.isDisabled ? 'eye' : 'eye-off';
    this.color = this.areaSummary.isClosed ? 'secondary' : 'danger';
    this.area = this.areaSummary.number;
    this.isSystemActive = this.alarmSystemService.getIsSystemActive();
  }

  private handleEnableOrDisableAreaIndicatorTap(): void {
    const isDisabled = this.alarmSystemService.isDisabled(this.area);

    if (isDisabled) {
      this.alarmSystemService.enableArea(this.area);
    } else {
      this.alarmSystemService.disableArea(this.area);
    }
  }

  private handleSystemStateUpdate(systemStateUpdate: boolean): void {
    this.isSystemActive = systemStateUpdate;
  }

  private handleAvailabilityUpdate(areaUpdate: AreaAvailability): void {
    if (areaUpdate.isDisabled) {
      this.iconName = 'eye';
    } else {
      this.iconName = 'eye-off';
    }
  }
}
