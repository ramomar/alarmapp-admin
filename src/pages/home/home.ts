import { AfterViewInit, Component, ContentChildren, OnDestroy, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FloorDiagramCard } from '../../components/floor_diagram_card';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {

  @ContentChildren('firstFloorCard')
  firstFloorCard: FloorDiagramCard;

  @ContentChildren('secondFloorCard')
  secondFloorCard: FloorDiagramCard;

  private overviewSegments: string;


  constructor(public navCtrl: NavController) {
    this.overviewSegments = 'summarySegment';
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }
}
