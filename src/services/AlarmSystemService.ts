import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AreaFloorMappings } from '../constants/alarmConstants';
import { parseAlarmStateMessage } from './parsing/alarmStateMessageParsing';

export interface AlarmSystemBackend {
  activateSystem(areas: Array<AreaAvailability>): Promise<any>;

  deactivateSystem(): Promise<any>;

  activateSystem(areas: Array<AreaAvailability>): Promise<any>;

  deactivateSystem(): Promise<any>;

  getSystemState(): Promise<any>;

  open(onOpen: () => void): void;

  setOnErrorHandler(onError: (error) => void): void;

  close(): void;

  onSystemState(handler: (object) => void): void;

  testSiren(durationSecs: number): Promise<any>;

  triggerPanic(): Promise<any>;
}

export interface AlarmStateBackend {
  readonly alarmStateUpdate$;

  readonly availabilityUpdate$;

  readonly systemStateUpdate$;

  updateState(alarmStateSummary: AlarmStateSummary): void

  enableArea(area: number): void;

  disableArea(area: number): void;

  isDisabled(area: number): boolean;

  activateSystem(): void;

  deactivateSystem(): void;

  isReadyToActivate(): boolean;

  isFloorReady(floor: number): boolean;

  isActive(): boolean;

  getAreas(): Array<AreaAvailability>;

  getAreasForFloor(floor: number): Array<AreaAvailability>;

  getDisabledAreasCountForFloor(floor: number): number;

  getOpenAreasCountForFloor(floor: number): number;

  allAreasDisabled(): boolean;

  allAreasDisabledForFloor(floor: number): boolean;

}

@Injectable()
export class AlarmSystemService {
  readonly alarmStateUpdate$: Observable<AlarmStateSummary> =
    this.alarmStateBackend.alarmStateUpdate$;

  readonly availabilityUpdate$: Observable<AreaAvailability> =
    this.alarmStateBackend.availabilityUpdate$;

  // May be a good idea to wrap this boolean in an object.
  readonly systemStatusUpdate$: Observable<boolean> =
    this.alarmStateBackend.systemStateUpdate$;

  constructor(private alarmSystemBackend: AlarmSystemBackend,
              private alarmStateBackend: AlarmStateBackend) {

  }

  public start(timeoutMs: number = 10000): Promise<any> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.alarmSystemBackend.close();
        reject(new Error('EventSource timed out'));
      }, timeoutMs);

      this.alarmSystemBackend.open(() => {
        clearTimeout(timer);

        this.alarmSystemBackend.onSystemState(messageEnvelope => {
          const { data } = messageEnvelope;

          const message = JSON.parse(data);

          const alarmState: AlarmStateSummary = parseAlarmStateMessage(message.data);

          this.alarmStateBackend.updateState(alarmState);
        });

        Promise.resolve({ result: '0-0-0-0-0-1|0|0' }).then(response => {
          //this.alarmSystemBackend.getSystemState().then(response => {
          if (response.result) {
            const alarmState: AlarmStateSummary = parseAlarmStateMessage(response.result);

            this.alarmStateBackend.updateState(alarmState);
          } else {
            throw  Error('getSystemState() request failed!');
          }
        }).then(resolve, reject);
      });
    });
  }

  public stop(): void {
    this.alarmSystemBackend.close();
  }

  public activateSystem(): void {
    const areas = this.getAreas();

    this.activateSystemP(areas);
  }

  public deactivateSystem(): void {
    this.alarmSystemBackend.deactivateSystem().then(_ => {
      this.alarmStateBackend.deactivateSystem();
    });
  }

  public activateSystemForFloor(floor: number): void {
    const areas = this.getAreas();
    const floorAreas = new Set(this.getAreasForFloor(floor).map(area => area.number));

    const updatedAreas = areas.map(area => {
      return new AreaAvailability(
        area.number,
        floorAreas.has(area.number) ? this.isDisabled(area.number) : true
      );
    });

    updatedAreas.forEach(area => {
      if (area.isDisabled) {
        this.disableArea(area.number);
      } else {
        this.enableArea(area.number);
      }
    });

    this.activateSystemP(updatedAreas);
  }

  public isActive(): boolean {
    return this.alarmStateBackend.isActive();
  }

  public isReadyToActivate(): boolean {
    return this.alarmStateBackend.isReadyToActivate();
  }

  public isFloorReady(floor: number): boolean {
    return this.alarmStateBackend.isFloorReady(floor);
  }

  public enableArea(area: number): void {
    this.alarmStateBackend.enableArea(area);
  }

  public disableArea(area: number): void {
    this.alarmStateBackend.disableArea(area);
  }

  public isDisabled(area: number): boolean {
    return this.alarmStateBackend.isDisabled(area);
  }

  public getAreas(): Array<AreaAvailability> {
    return this.alarmStateBackend.getAreas();
  }

  public getAreasForFloor(floor: number): Array<AreaAvailability> {
    return this.alarmStateBackend.getAreasForFloor(floor);
  }

  public getDisabledAreasCountForFloor(floor: number): number {
    return this.alarmStateBackend.getDisabledAreasCountForFloor(floor);
  }

  public getOpenAreasCountForFloor(floor: number): number {
    return this.alarmStateBackend.getOpenAreasCountForFloor(floor);
  }

  public testSiren(durationMs: number): Promise<any> {
    return this.alarmSystemBackend.testSiren(durationMs);
  }

  public triggerPanic(): Promise<any> {
    return this.alarmSystemBackend.triggerPanic();
  }

  public allAreasDisabled(): boolean {
    return this.alarmStateBackend.allAreasDisabled();
  }

  public allAreasDisabledForFloor(floor: number): boolean {
    return this.alarmStateBackend.allAreasDisabledForFloor(floor);
  }

  private activateSystemP(areas: Array<AreaAvailability>): void {
    this.alarmSystemBackend.activateSystem(areas).then(_ => {
      this.alarmStateBackend.activateSystem();
    });
  }
}

export class AlarmStateSummary {

  constructor(readonly areas: Array<AreaSummary>,
              readonly isSirenActive: boolean,
              readonly isSystemActive: boolean) {

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

export class AreaAvailability {

  constructor(readonly number: number, readonly isDisabled: boolean) {
    this.number = number;
    this.isDisabled = isDisabled;
  }
}
