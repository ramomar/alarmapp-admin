import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from 'ionic-angular';
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
              private alertCtrl: AlertController,
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

  private notProtectingAnythingAlert(): void {
    const alertOptions = {
      title: 'No es seguro activar el sistema',
      message: 'Todas las areas están desactivadas en este piso.',
      buttons: [
        { text: 'De acuerdo' }
      ]
    };

    const alert = this.alertCtrl.create(alertOptions);

    alert.present();
  }

  private presentOpenAreasAlert(): void {
    const alertOptions = {
      title: 'Areas abiertas',
      message: 'Tienes algunas areas abiertas en este piso. Por favor deshabilitalas o cierralas.',
      buttons: [
        { text: 'De acuerdo' }
      ]
    };

    const alert = this.alertCtrl.create(alertOptions);

    alert.present()
  }

  private activateSystemOnlyInFloorButton(): void {
    if (this.alarmSystemService.isFloorReady(this.floorNumber)) {
      if (this.alarmSystemService.allAreasDisabledForFloor(this.floorNumber)) {
        this.notProtectingAnythingAlert();
      } else {
        this.alarmSystemService.activateSystemForFloor(this.floorNumber);
      }
    } else {
      this.presentOpenAreasAlert();
    }
  }

  private handleSystemStatusUpdate(statusUpdate: NetworkUpdate) {
    this.isDisconnected = !statusUpdate.isOnline;
  }

  private handleSystemUpdate(): void {
    this.isSystemActive = this.alarmSystemService.isActive();

    this.openAreasCount = this.alarmSystemService
      .getOpenAreasCountForFloor(this.floorNumber);

    this.disabledAreasCount = this.alarmSystemService
      .getDisabledAreasCountForFloor(this.floorNumber);
  }
}