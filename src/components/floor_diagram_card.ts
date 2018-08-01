import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {AlarmStateSummary, AreaSummary, AreaZonesMappings} from '../services/parsing/parsing';
import { AlarmStateService } from '../services/AlarmStateService';

@Component({
  selector: 'floor-diagram-card',
  templateUrl: './floor_diagram_card.html'
})
export class FloorDiagramCard {

  @Input()
  cardTitle: string;

  @Input()
  floorNumber: string;

  @ViewChild('floorDiagram')
  floorDiagram: ElementRef;

  private ctaDisabled: boolean;

  private openAreas: number;

  private areas: Array<AreaSummary>;

  constructor(private alarmStateService: AlarmStateService) {
    this.areas = [];

    alarmStateService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update) });
  }

  public handleAlarmStateUpdate(alarmStateUpdate: AlarmStateSummary): void {
    this.ctaDisabled = alarmStateUpdate.systemIsActive;
    this.areas = alarmStateUpdate.getAreasForFloor(parseInt(this.floorNumber, 10));
    this.openAreas = this.areas.filter(a => !a.isClosed).length;

    const diagram = this.floorDiagram.nativeElement.firstElementChild;

    this.areas.forEach(area => {
      AreaZonesMappings.get(area.areaNumber).forEach(zone => {
        const zoneElement = diagram.getElementById(zone);
          zoneElement.classList
            .remove(area.isClosed ? 'deactivated-area' : 'activated-area');
          zoneElement.classList
            .add(area.isClosed ? 'activated-area' : 'deactivated-area');

          zoneElement.style.fill = area.isClosed ? '#32db64' : '#f53d3d';

      });
    });
  }
}
