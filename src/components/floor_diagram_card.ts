import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  AlarmSystemService,
  AlarmStateSummary,
  AreaSummary,
  AreaAvailability
} from '../services/AlarmSystemService';
import {
  ZoneAreaMappings,
  AreaFloorMappings,
  AreaZonesMappings
} from '../constants/alarmConstants';

@Component({
  selector: 'floor-diagram-card',
  templateUrl: './floor_diagram_card.html'
})
export class FloorDiagramCard implements OnInit {

  @Input()
  cardTitle: string;

  @Input()
  floorNumberInput: string;

  @ViewChild('floorDiagram')
  floorDiagram: ElementRef;

  private floorNumber: number;

  private isLoading: boolean;

  private isSystemActive: boolean;

  private diagram;

  private openAreasCount: number;

  private disabledAreasCount: number;

  constructor(private alarmSystemService: AlarmSystemService) {
    this.isLoading = true;

    this.alarmSystemService
      .systemStateUpdate$
      .subscribe(isActive => { this.isSystemActive = isActive; });

    this.alarmSystemService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update); });

    this.alarmSystemService
      .availabilityUpdate$
      .subscribe(update => { this.handleAvailabilityUpdate(update); });
  }

  ngOnInit() {
    this.floorNumber = parseInt(this.floorNumberInput, 10);

    this.diagram = this.floorDiagram.nativeElement.firstElementChild;
  }

  public handleAlarmStateUpdate(alarmStateUpdate: AlarmStateSummary): void {
    this.isLoading = false;

    const areas = alarmStateUpdate.getAreasForFloor(this.floorNumber);

    this.openAreasCount = areas.filter(a => !a.isClosed).length;

    this.disabledAreasCount = areas.filter(a => a.isDisabled).length;

    areas.forEach(area => { this.fillStroke(area) });
  }

  private activateSystemOnlyInFloorButton(): void {
    this.alarmSystemService.activateSystemForFloor(this.floorNumber);
  }

  private enableOrDisableAreaButton(event): void {
    const zone = event.target.getAttribute('data-area-name');

    if (!this.isLoading && !this.isSystemActive && ZoneAreaMappings.has(zone)) {
      const area = ZoneAreaMappings.get(zone);

      this.enableOrDisableArea(area);
    }
  }

  private handleAvailabilityUpdate(areaAvailabilityUpdate: AreaAvailability): void {
    this.disabledAreasCount = this.alarmSystemService
      .getDisabledAreasCountForFloor(this.floorNumber);

    if (AreaFloorMappings.get(areaAvailabilityUpdate.number) === this.floorNumber) {
      if (areaAvailabilityUpdate.isDisabled) {
        this.fillArea(areaAvailabilityUpdate.number, 'silver');
      } else {
        this.fillArea(areaAvailabilityUpdate.number, 'white');
      }
    }
  }

  private enableOrDisableArea(area: number): void {
    if (this.alarmSystemService.isDisabled(area)) {
      this.alarmSystemService.enableArea(area);
    } else {
      this.alarmSystemService.disableArea(area);
    }

    this.disabledAreasCount = this.alarmSystemService.getDisabledAreasCountForFloor(this.floorNumber);
  }

  private fillStroke(area: AreaSummary): void {
    AreaZonesMappings.get(area.number).forEach(zone => {
      const zoneElement = this.diagram.querySelector(`[data-area-name=${zone}]`);

      if (this.alarmSystemService.isDisabled(area.number)) {
        zoneElement.style.fill = 'silver';
      } else {
        zoneElement.style.fill = 'white';
      }

      zoneElement.style.stroke = area.isClosed ? '#32db64' : '#f53d3d';
    });
  }

  private fillArea(areaNumber: number, color: string) {
    AreaZonesMappings.get(areaNumber).forEach(zone => {
      const zoneElement = this.diagram.querySelector(`[data-area-name=${zone}]`);

      zoneElement.style.fill = color;
    });
  }
}
