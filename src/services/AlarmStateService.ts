import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AreaFloorMappings } from '../constants/alarmConstants';

@Injectable()
export class AlarmStateService {

  private disabledAreas: Set<number>;

  private alarmStateUpdateSource: Subject<AlarmStateSummary>;

  readonly alarmStateUpdate$;

  private availabilityUpdateSource: Subject<AreaAvailabilityUpdate>;

  readonly availabilityUpdate$;

  private isSystemActive: boolean;

  private systemStateUpdateSource: Subject<boolean>;

  readonly systemStateUpdate$;

  constructor() {
    this.alarmStateUpdateSource = new Subject<AlarmStateSummary>();

    this.alarmStateUpdate$ = this.alarmStateUpdateSource.asObservable();

    this.disabledAreas = new Set<number>();

    this.availabilityUpdateSource = new Subject<AreaAvailabilityUpdate>();

    this.availabilityUpdate$ = this.availabilityUpdateSource.asObservable();

    this.systemStateUpdateSource = new Subject<boolean>();

    this.systemStateUpdate$ = this.systemStateUpdateSource.asObservable();
  }

  public updateState(alarmStateSummary: AlarmStateSummary) {
    this.alarmStateUpdateSource.next(alarmStateSummary);
  }

  public disableArea(area: number): void {
    this.disabledAreas.add(area);

    this.availabilityUpdateSource.next(new AreaAvailabilityUpdate(area, true));
  }

  public enableArea(area: number): void {
    this.disabledAreas.delete(area);

    this.availabilityUpdateSource.next(new AreaAvailabilityUpdate(area, false));
  }

  public isDisabled(area: number): boolean {
    return this.disabledAreas.has(area);
  }

  public getDisabledAreasCountForFloor(floor: number): number {
    let count = 0;

    this.disabledAreas.forEach(area => {
      if (AreaFloorMappings.get(area) === floor) {
        count += 1;
      }
    });

    return count;
  }

  public activateSystem(): void {
    this.isSystemActive = true;
    this.systemStateUpdateSource.next(true);
  }

  public deactivateSystem(): void {
    this.isSystemActive = false;
    this.systemStateUpdateSource.next(false);
  }

  public getSystemState(): boolean {
    return this.isSystemActive;
  }
}

export class AlarmStateSummary {

  constructor(readonly areas: Array<AreaSummary>,
              readonly sirenIsActive: boolean,
              readonly systemIsActive: boolean) {

  }

  getAreasForFloor(floorNumber: number): Array<AreaSummary> {
    return this.areas.filter(a => AreaFloorMappings.get(a.number) === floorNumber);
  }
}

export class AreaSummary {

  constructor(readonly number: number,
              readonly isClosed: boolean,
              readonly isDisabled: boolean) {
  }
}

export class AreaAvailabilityUpdate {
  readonly area: number;
  readonly isDisabled: boolean;

  constructor(area: number, isDisabled: boolean) {
    this.area = area;
    this.isDisabled = isDisabled;
  }
}
