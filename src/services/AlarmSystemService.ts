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

  getDisabledAreasCountForFloor(floor: number): number

  activateSystem(): void

  deactivateSystem(): void

  getSystemState(): boolean
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

      this.handleSystemStateEvent(alarmState);
    });

    this.alarmSystemBackend.getSystemState().then(response => {
      const alarmState: AlarmStateSummary = parseAlarmStateMessage(response.result);

      this.handleSystemStateEvent(alarmState);
    }).catch(onError);
  }

  public stop(): void {
    this.alarmSystemBackend.close();
  }

  public activateSystem(): void {
    this.alarmSystemBackend.activateSystem([]).then(_ => {
      this.alarmStateBackend.activateSystem();
    });
  }

  public deactivateSystem(): void {
    this.alarmSystemBackend.deactivateSystem().then(_ => {
      this.alarmStateBackend.deactivateSystem();
    });
  }

  public getSystemState(): boolean {
    return this.alarmStateBackend.getSystemState();
  }

  public updateState(alarmStateSummary: AlarmStateSummary): void {
    alarmStateSummary.areas.forEach(area => {
      if (area.isDisabled) {
        this.alarmStateBackend.disableArea(area.number);
      } else {
        this.alarmStateBackend.enableArea(area.number);
      }
    });

    this.alarmStateBackend.updateState(alarmStateSummary);
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

  public getDisabledAreasCountForFloor(floor: number): number {
    return this.alarmStateBackend.getDisabledAreasCountForFloor(floor);
  }

  private handleSystemStateEvent(alarmStateSummary: AlarmStateSummary): void {
    if (alarmStateSummary.isSystemActive) {
      this.activateSystem();
    } else {
      this.deactivateSystem();
    }

    this.updateState(alarmStateSummary);
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
