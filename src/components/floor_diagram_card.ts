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
import { NetworkService, NetworkUpdate } from '../services/NetworkService';

@Component({
  selector: 'floor-diagram-card',
  templateUrl: './floor_diagram_card.html'
})
export class FloorDiagramCard implements OnInit {

  @Input()
  cardTitle: string;

  @Input()
  floorNumberString: string;

  @ViewChild('floorDiagram')
  floorDiagram: ElementRef;

  private floorNumber: number;

  private isLoading: boolean;

  private isSystemActive: boolean;

  private isDisconnected: boolean;

  private diagram;

  constructor(private alarmSystemService: AlarmSystemService,
              private networkService: NetworkService) {
    this.isLoading = true;

    this.isDisconnected = networkService.isDisconnected();

    this.networkService.networkUpdate$.subscribe(update => {
      this.handleSystemStatusUpdate(update);
    });

    this.alarmSystemService
      .systemStatusUpdate$
      .subscribe(isActive => { this.isSystemActive = isActive; });

    this.alarmSystemService
      .alarmStateUpdate$
      .subscribe(update => { this.handleAlarmStateUpdate(update); });

    this.alarmSystemService
      .availabilityUpdate$
      .subscribe(update => { this.handleAvailabilityUpdate(update); });
  }

  ngOnInit() {
    this.floorNumber = parseInt(this.floorNumberString, 10);

    this.diagram = this.floorDiagram.nativeElement.firstElementChild;
  }

  private activateSystemOnlyInFloorButton(): void {
    this.alarmSystemService.activateSystemForFloor(this.floorNumber);
  }

  private enableOrDisableAreaButton(event): void {
    const zone = event.target.getAttribute('data-area-name');

    if (
      !this.isLoading &&
      !this.isSystemActive &&
      !this.isDisconnected &&
      ZoneAreaMappings.has(zone)
    ) {
      const area = ZoneAreaMappings.get(zone);

      this.enableOrDisableArea(area);
    }
  }

  private handleAlarmStateUpdate(alarmStateUpdate: AlarmStateSummary): void {
    this.isLoading = false;

    const areas = alarmStateUpdate.getAreasForFloor(this.floorNumber);

    areas.forEach(area => { this.fillStroke(area) });
  }

  private handleSystemStatusUpdate(statusUpdate: NetworkUpdate) {
    this.isDisconnected = !statusUpdate.isOnline;
  }

  private handleAvailabilityUpdate(areaAvailabilityUpdate: AreaAvailability): void {
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
