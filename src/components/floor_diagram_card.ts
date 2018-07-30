import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

  private safeFloorDiagramUrl: SafeResourceUrl;

  private nonWatchingCount: number;

  constructor(private sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.nonWatchingCount = 2;
    this.safeFloorDiagramUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.floorDiagramUrl);
  }

  public renderFloorState(t: any): void {
  }
}
