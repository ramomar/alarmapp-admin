import { Component } from '@angular/core';

@Component({
  selector: 'floor-diagram-card',
  templateUrl: './floor_diagram_card.html',
  inputs: ['title', 'floorDiagramUrl']
})
export class FloorDiagramCard {
  title: string;
  floorDiagramUrl: string;
  private nonWatchingCount: number;

  constructor() {
    this.nonWatchingCount = 3;
  }
}
