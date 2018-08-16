import { Subject, Observable } from 'rxjs';
import { AlarmStateBackend, AlarmStateSummary, AreaAvailability } from './AlarmSystemService';
import { AreaFloorMappings } from '../constants/alarmConstants';

export class AlarmStateService implements AlarmStateBackend {

  private areas: Set<number>;

  private disabledAreas: Set<number>;

  private openAreas: Set<number>;

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

    this.areas = new Set<number>();

    this.openAreas = new Set<number>();

    this.disabledAreas = new Set<number>();

    this.availabilityUpdateSource = new Subject<AreaAvailability>();

    this.availabilityUpdate$ = this.availabilityUpdateSource.asObservable();

    this.systemStateUpdateSource = new Subject<boolean>();

    this.systemStateUpdate$ = this.systemStateUpdateSource.asObservable();
  }

  public updateState(alarmStateSummary: AlarmStateSummary): void {
    if (alarmStateSummary.isSystemActive) {
      this.activateSystem();
    } else {
      this.deactivateSystem();
    }

    this.openAreas = new Set(
      Array.from(alarmStateSummary.areas)
        .filter(area => !area.isClosed)
        .map(area => area.number)
    );

    alarmStateSummary.areas.forEach(area => {
      if (area.isDisabled) {
        this.disableArea(area.number);
      } else {
        this.enableArea(area.number);
      }
    });

    alarmStateSummary.areas.forEach(area => {
      this.areas.add(area.number); // It is ok to just add areas to the set.
    });

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

  public getAreas(): Array<AreaAvailability> {
    return Array.from(this.areas).map(area =>
      new AreaAvailability(
        area,
        this.disabledAreas.has(area)
      )
    );
  }

  public getAreasForFloor(floor: number): Array<AreaAvailability> {
    return this.getAreas()
      .filter(area => AreaFloorMappings.get(area.number) === floor);
  }

  public getDisabledAreasCountForFloor(floor: number): number {
    return this.getAreasForFloor(floor)
      .filter(area => area.isDisabled)
      .length;
  }

  public getOpenAreasCountForFloor(floor: number): number {
    return Array.from(this.openAreas)
      .filter(area => AreaFloorMappings.get(area) === floor)
      .length;
  }

  public activateSystem(): void {
    this.isSystemActive = true;
    this.systemStateUpdateSource.next(true);
  }

  public deactivateSystem(): void {
    this.isSystemActive = false;
    this.systemStateUpdateSource.next(false);
  }

  public getIsSystemActive(): boolean {
    return this.isSystemActive;
  }
}
