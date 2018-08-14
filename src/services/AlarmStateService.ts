import { Subject, Observable } from 'rxjs';
import { AlarmStateBackend, AlarmStateSummary, AreaAvailability } from './AlarmSystemService';
import { AreaFloorMappings } from '../constants/alarmConstants';

export class AlarmStateService implements AlarmStateBackend {

  private disabledAreas: Set<number>;

  private alarmStateUpdateSource: Subject<AlarmStateSummary>;

  readonly alarmStateUpdate$: Observable<AlarmStateSummary>;

  private availabilityUpdateSource: Subject<AreaAvailability>;

  readonly availabilityUpdate$: Observable<AreaAvailability>;

  private isSystemActive: boolean;

  private systemStateUpdateSource: Subject<boolean>;

  readonly systemStateUpdate$: Observable<boolean>;

  constructor() {
    this.alarmStateUpdateSource = new Subject<AlarmStateSummary>();

    this.alarmStateUpdate$ = this.alarmStateUpdateSource.asObservable();

    this.disabledAreas = new Set<number>();

    this.availabilityUpdateSource = new Subject<AreaAvailability>();

    this.availabilityUpdate$ = this.availabilityUpdateSource.asObservable();

    this.systemStateUpdateSource = new Subject<boolean>();

    this.systemStateUpdate$ = this.systemStateUpdateSource.asObservable();
  }

  public updateState(alarmStateSummary: AlarmStateSummary): void {
    this.isSystemActive = alarmStateSummary.isSystemActive;
    this.alarmStateUpdateSource.next(alarmStateSummary);
  }

  public disableArea(area: number): void {
    this.disabledAreas.add(area);

    this.availabilityUpdateSource.next(new AreaAvailability(area, true));
  }

  public enableArea(area: number): void {
    this.disabledAreas.delete(area);

    this.availabilityUpdateSource.next(new AreaAvailability(area, false));
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
