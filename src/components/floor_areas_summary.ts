import { Component, Input, OnInit } from '@angular/core';
import { merge } from 'rxjs/observable/merge';
import { AlarmSystemService } from '../services/AlarmSystemService';

@Component({
  selector: 'floor-areas-summary',
  templateUrl: './floor_areas_summary.html'
})
export class FloorAreasSummary implements OnInit {

  @Input()
  floorNumberString: string;

  private floorNumber: number;

  private openAreasCount: number;

  private disabledAreasCount: number;

  private isDisconnected: boolean;

  private isSystemActive: boolean;

  constructor(private alarmSystemService: AlarmSystemService) {
    merge(
      this.alarmSystemService.availabilityUpdate$,
      this.alarmSystemService.systemStatusUpdate$
    ).subscribe(_ => { this.handleSystemUpdate(); });
  }

  ngOnInit(): void {
    this.floorNumber = parseInt(this.floorNumberString, 10);

    this.openAreasCount = this.alarmSystemService
      .getOpenAreasCountForFloor(this.floorNumber);

    this.disabledAreasCount = this.alarmSystemService
      .getDisabledAreasCountForFloor(this.floorNumber);
  }

  private handleSystemUpdate(): void {
    this.isSystemActive = this.alarmSystemService.getIsSystemActive();

    this.openAreasCount = this.alarmSystemService
      .getOpenAreasCountForFloor(this.floorNumber);

    this.disabledAreasCount = this.alarmSystemService
      .getDisabledAreasCountForFloor(this.floorNumber);
  }

  private activateSystemOnlyInFloorButton(): void {
    this.alarmSystemService.activateSystemForFloor(this.floorNumber);
  }
}