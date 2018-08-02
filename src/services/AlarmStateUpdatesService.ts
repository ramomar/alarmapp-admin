import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlarmStateSummary } from './parsing/parsing';

@Injectable()
export class AlarmStateUpdatesService {

  private alarmStateUpdateSource: Subject<AlarmStateSummary>;

  readonly alarmStateUpdate$;

  constructor() {
    this.alarmStateUpdateSource = new Subject<AlarmStateSummary>();
    this.alarmStateUpdate$ = this.alarmStateUpdateSource.asObservable();
  }

  public notifyAlarmStateUpdate(alarmStateSummary: AlarmStateSummary) {
    this.alarmStateUpdateSource.next(alarmStateSummary);
  }
}
