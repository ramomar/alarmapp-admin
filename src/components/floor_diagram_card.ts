import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  AlarmStateSummary, AreaFloorMappings, AreaSummary,
  AreaZonesMappings
} from '../services/parsing/parsing';
import { AlarmStateUpdatesService } from '../services/AlarmStateUpdatesService';

import { ZoneAreaMappings } from '../services/parsing/parsing';
import {
  AlarmAvailabilityService,
  AreaAvailabilityUpdate
} from '../services/AlarmAvailabilityService';

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

  private ctaDisabled: boolean;

  private hasAreas: boolean;

  private diagram;

  private openAreasCount: number;

  private disabledAreasCount: number;

  constructor(private alarmStateUpdatesService: AlarmStateUpdatesService,
              private alarmAvailabilityService: AlarmAvailabilityService) {
    this.hasAreas = false;

    alarmStateUpdatesService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update) });

    this.alarmAvailabilityService
      .availabilityUpdate$
      .subscribe(update => { this.handleAvailabilityUpdate(update) });
  }

  ngOnInit() {
    this.floorNumber = parseInt(this.floorNumberInput, 10);
    this.diagram = this.floorDiagram.nativeElement.firstElementChild;
  }

  public handleAlarmStateUpdate(alarmStateUpdate: AlarmStateSummary): void {
    this.hasAreas = true;

    this.ctaDisabled = alarmStateUpdate.systemIsActive;

    const areas = alarmStateUpdate.getAreasForFloor(this.floorNumber);

    this.openAreasCount = areas.filter(a => !a.isClosed).length;

    this.disabledAreasCount = areas.filter(a => a.isDisabled).length;

    areas.forEach(area => {
      if (!area.isDisabled) {
        this.alarmAvailabilityService.enableArea(area.number);
      } else {
        this.alarmAvailabilityService.disableArea(area.number);
      }
    });

    areas.forEach(area => { this.fillStroke(area) });
  }

  private handleEnableOrDisableAreaButtonClick(event): void {
    const zone = event.target.getAttribute('data-area-name');

    if (this.hasAreas && ZoneAreaMappings.has(zone)) {
      const area = ZoneAreaMappings.get(zone);

      this.enableOrDisableArea(area);
    }
  }

  private handleAvailabilityUpdate(areaAvailabilityUpdate: AreaAvailabilityUpdate): void {
    if (AreaFloorMappings.get(areaAvailabilityUpdate.area) === this.floorNumber) {
      if (areaAvailabilityUpdate.disable) {
        this.fillArea(areaAvailabilityUpdate.area, 'silver');
      } else {
        this.fillArea(areaAvailabilityUpdate.area, 'white');
      }
    }
  }

  private enableOrDisableArea(area: number): void {
    if (this.alarmAvailabilityService.isDisabled(area)) {
      this.alarmAvailabilityService.enableArea(area);
    } else {
      this.alarmAvailabilityService.disableArea(area);
    }

    this.disabledAreasCount = this.alarmAvailabilityService
      .disabledAreasCountForFloor(this.floorNumber);
  }

  private fillStroke(area: AreaSummary): void {
    AreaZonesMappings.get(area.number).forEach(zone => {
      const zoneElement = this.diagram.querySelector(`[data-area-name=${zone}]`);

      if (this.alarmAvailabilityService.isDisabled(area.number)) {
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
