import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AreaFloorMappings } from '../constants/alarmConstants';
import { parseAlarmStateMessage } from './parsing/alarmStateMessageParsing';

export interface AlarmSystemBackend {
  activateSystem(areas: Array<AreaAvailability>): Promise<any>;

  deactivateSystem(): Promise<any>;

  activateSystem(areas: Array<AreaAvailability>): Promise<any>

  deactivateSystem(): Promise<any>

  getSystemState(): Promise<any>

  open(onError: (error: any) => void): void

  close(): void

  onSystemState(handler: (object) => void): void
}

export interface AlarmStateBackend {
  readonly alarmStateUpdate$;

  readonly availabilityUpdate$;

  readonly systemStateUpdate$;

  updateState(alarmStateSummary: AlarmStateSummary): void

  enableArea(area: number): void

  disableArea(area: number): void

  isDisabled(area: number): boolean

  activateSystem(): void

  deactivateSystem(): void

  getIsSystemActive(): boolean

  getAreas(): Array<AreaAvailability>

  getAreasForFloor(floor: number): Array<AreaAvailability>

  getDisabledAreasCountForFloor(floor: number): number
}

@Injectable()
export class AlarmSystemService {
  readonly alarmStateUpdate$: Observable<AlarmStateSummary> =
    this.alarmStateBackend.alarmStateUpdate$;

  readonly availabilityUpdate$: Observable<AreaAvailability> =
    this.alarmStateBackend.availabilityUpdate$;

  readonly systemStateUpdate$: Observable<boolean> =
    this.alarmStateBackend.systemStateUpdate$;

  constructor(private alarmSystemBackend: AlarmSystemBackend,
              private alarmStateBackend: AlarmStateBackend) {
  }

  public start(onError: (error: any) => void): void {
    this.alarmSystemBackend.open(onError);

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
        throw new Error('getSystemState() request failed!');
      }
    }).catch(onError);
  }

  public stop(): void {
    this.alarmSystemBackend.close();
  }

  public activateSystem(areas: Array<AreaAvailability>): void {
    this.alarmSystemBackend.activateSystem(areas).then(_ => {
      this.alarmStateBackend.activateSystem();
    });
  }

  public deactivateSystem(): void {
    this.alarmSystemBackend.deactivateSystem().then(_ => {
      this.alarmStateBackend.deactivateSystem();
    });
  }

  public getIsSystemActive(): boolean {
    return this.alarmStateBackend.getIsSystemActive();
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
