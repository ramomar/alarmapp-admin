import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {AlarmStateSummary, AreaSummary, AreaZonesMappings} from '../services/parsing/parsing';
import { AlarmStateUpdatesService } from '../services/AlarmStateUpdatesService';

import { ZoneAreaMappings } from '../services/parsing/parsing';

@Component({
  selector: 'floor-diagram-card',
  templateUrl: './floor_diagram_card.html'
})
export class FloorDiagramCard implements OnInit {

  @Input()
  cardTitle: string;

  @Input()
  floorNumber: string;

  @ViewChild('floorDiagram')
  floorDiagram: ElementRef;

  private ctaDisabled: boolean;

  private hasAreas: boolean;

  private disabledAreas: Set<number>;

  private diagram;

  private openAreasCount: number;

  private disabledAreasCount: number;

  constructor(private alarmStateUpdatesService: AlarmStateUpdatesService) {
    this.hasAreas = false;

    this.disabledAreas = new Set<number>();

    alarmStateUpdatesService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update) });
  }

  ngOnInit() {
    this.diagram = this.floorDiagram.nativeElement.firstElementChild;
  }

  public handleAlarmStateUpdate(alarmStateUpdate: AlarmStateSummary): void {
    this.hasAreas = true;

    this.ctaDisabled = alarmStateUpdate.systemIsActive;

    const areas = alarmStateUpdate.getAreasForFloor(parseInt(this.floorNumber, 10));

    this.openAreasCount = areas.filter(a => !a.isClosed).length;

    this.disabledAreasCount = areas.filter(a => a.isDisabled).length;

    areas.forEach(area => {
      if (!area.isDisabled) {
        this.disabledAreas.delete(area.number);
      } else {
        this.disabledAreas.add(area.number);
      }
    });

    areas.forEach(area => { this.fillStroke(area) });
  }

  private enableOrDisableArea(event): void {
    const zone = event.target.getAttribute('data-area-name');

    if (this.hasAreas && ZoneAreaMappings.has(zone)) {
      const areaNumber = ZoneAreaMappings.get(zone);

      if (this.disabledAreas.has(areaNumber)) {
        this.disabledAreas.delete(areaNumber);
        this.fillArea(areaNumber, 'white');
      } else {
        this.disabledAreas.add(areaNumber);
        this.fillArea(areaNumber, 'silver');
      }
    }

    this.disabledAreasCount = this.disabledAreas.size;
  }

  private fillStroke(area: AreaSummary): void {
    AreaZonesMappings.get(area.number).forEach(zone => {
      const zoneElement = this.diagram.querySelector(`[data-area-name=${zone}]`);

      if (this.disabledAreas.has(area.number)) {
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
