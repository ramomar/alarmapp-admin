import { Component, Input, OnInit } from '@angular/core';
import { merge } from 'rxjs/observable/merge';
import { AlarmSystemService } from '../services/AlarmSystemService';
import { NetworkService, NetworkUpdate } from '../services/NetworkService';

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

  constructor(private alarmSystemService: AlarmSystemService,
              private networkService: NetworkService) {
    this.isDisconnected = this.networkService.isDisconnected();

    this.networkService.networkUpdate$.subscribe(update => {
      this.handleSystemStatusUpdate(update);
    });

    merge(
      this.alarmSystemService.availabilityUpdate$,
      this.alarmSystemService.systemStatusUpdate$
    ).subscribe(() => { this.handleSystemUpdate(); });
  }

  ngOnInit(): void {
    this.floorNumber = parseInt(this.floorNumberString, 10);

    this.openAreasCount = this.alarmSystemService
      .getOpenAreasCountForFloor(this.floorNumber);

    this.disabledAreasCount = this.alarmSystemService
      .getDisabledAreasCountForFloor(this.floorNumber);
  }

  private activateSystemOnlyInFloorButton(): void {
    this.alarmSystemService.activateSystemForFloor(this.floorNumber);
  }

  private handleSystemStatusUpdate(statusUpdate: NetworkUpdate) {
    this.isDisconnected = !statusUpdate.isOnline;
  }

  private handleSystemUpdate(): void {
    this.isSystemActive = this.alarmSystemService.getIsSystemActive();

    this.openAreasCount = this.alarmSystemService
      .getOpenAreasCountForFloor(this.floorNumber);

    this.disabledAreasCount = this.alarmSystemService
      .getDisabledAreasCountForFloor(this.floorNumber);
  }
}