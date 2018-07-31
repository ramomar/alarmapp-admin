import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AreaSummary, AreaZonesMappings } from '../services/parsing/parsing';

@Component({
  selector: 'floor-diagram-card',
  templateUrl: './floor_diagram_card.html'
})
export class FloorDiagramCard {

  @Input()
  cardTitle: string;

  @ViewChild('floorDiagram')
  floorDiagram: ElementRef;

  private ctaDisabled: boolean;

  private openAreas: number;

  private areas: Array<AreaSummary>;

  constructor() {
    this.areas = [];
  }

  public updateComponentState(areas: Array<AreaSummary>, systemIsActive: boolean): void {
    this.ctaDisabled = systemIsActive;
    this.openAreas = areas.filter(a => !a.isClosed).length;
    this.areas = areas;

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
