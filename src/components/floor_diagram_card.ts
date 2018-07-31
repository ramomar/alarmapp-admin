import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AreaSummary, AreaZonesMappings } from "../services/parsing/parsing";

@Component({
  selector: 'floor-diagram-card',
  templateUrl: './floor_diagram_card.html'
})
export class FloorDiagramCard implements OnInit {

  @Input()
  cardTitle: string;

  @Input()
  diagramHtmlId: string;

  @Input()
  floorDiagramUrl: string;

  @ViewChild('floorDiagram')
  floorDiagram: ElementRef;

  private safeFloorDiagramUrl: SafeResourceUrl;

  private openAreas: number;

  private areas: Array<AreaSummary>;

  constructor(private sanitizer: DomSanitizer) {
    this.areas = [];
  }

  ngOnInit() {
    this.safeFloorDiagramUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.floorDiagramUrl);
  }

  ngAfterViewInit() {
  }

  public updateComponentState(areas: Array<AreaSummary>): void {
    this.openAreas = areas.filter(a => !a.isClosed).length;
    this.areas = areas;

    const diagram = this.floorDiagram.nativeElement.contentDocument;

    this.areas.forEach(area => {
      AreaZonesMappings.get(area.areaNumber).forEach(zone => {
        diagram.getElementById(zone).style.fill = area.isClosed ? '#32db64' : '#f53d3d';
      });
    });
  }
}
