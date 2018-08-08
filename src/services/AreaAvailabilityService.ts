import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AreaFloorMappings } from './parsing/parsing';

@Injectable()
export class AreaAvailabilityService {

  private disabledAreas: Set<number>;

  private availabilityUpdateSource: Subject<AreaAvailabilityUpdate>;

  readonly availabilityUpdate$;

  constructor() {
    this.disabledAreas = new Set<number>();
    this.availabilityUpdateSource = new Subject<AreaAvailabilityUpdate>();
    this.availabilityUpdate$ = this.availabilityUpdateSource.asObservable();
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

export class AreaAvailabilityUpdate {
  readonly area: number;
  readonly disabled: boolean;

  constructor(area: number, isDisabled: boolean) {
    this.area = area;
    this.disabled = isDisabled;
  }
}
