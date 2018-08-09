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

  constructor() {
    this.alarmStateUpdateSource = new Subject<AlarmStateSummary>();

    this.alarmStateUpdate$ = this.alarmStateUpdateSource.asObservable();

    this.disabledAreas = new Set<number>();

    this.availabilityUpdateSource = new Subject<AreaAvailabilityUpdate>();

    this.availabilityUpdate$ = this.availabilityUpdateSource.asObservable();
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

  public disabledAreasCountForFloor(floor: number): number {
    let count = 0;

    this.disabledAreas.forEach(area => {
      if (AreaFloorMappings.get(area) === floor) {
        count += 1;
      }
    });

    return count;
  }
}

export class AlarmStateSummary {
  readonly areas: Array<AreaSummary>;
  readonly sirenIsActive: boolean;
  readonly systemIsActive: boolean;

  constructor(areas: Array<AreaSummary>,
              sirenIsActive: boolean,
              systemIsActive: boolean) {
    this.areas = areas;

    this.sirenIsActive = sirenIsActive;

    this.systemIsActive = systemIsActive;
  }

  getAreasForFloor(floorNumber: number): Array<AreaSummary> {
    return this.areas.filter(a => AreaFloorMappings.get(a.number) === floorNumber);
  }
}

export class AreaSummary {
  readonly number: number;
  readonly isClosed: boolean;
  readonly isDisabled: boolean;

  constructor(number: number,
              isClosed: boolean,
              isDisabled: boolean) {
    this.number = number;

    this.isClosed = isClosed;

    this.isDisabled = isDisabled;
  }
}

export class AreaAvailabilityUpdate {
  readonly area: number;
  readonly disabled: boolean;

  constructor(area: number, isDisabled: boolean) {
    this.area = area;
    this.disabled = isDisabled;
  }
}
