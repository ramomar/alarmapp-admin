import { Injectable } from '@angular/core';
import { retryFetch } from '../utils/retryFetch.js';

const Events = window['EventSource'];

@Injectable()
export class AlarmService {
  private eventsSource;
  private host: string;
  private accessToken: string;
  private eventPrefix: string;
  private deviceId: string;

  constructor(host: string,
              accessToken: string,
              eventPrefix: string = 'alarmState',
              deviceId: string) {
    this.host = host;
    this.accessToken = accessToken;
    this.eventPrefix = eventPrefix;
    this.deviceId = deviceId;
  }

  public open(onMessageHandler: (object) => void) {
    const path =[
      'v1',
      //'devices',
      //this.deviceId,
      'events',
      this.eventPrefix
    ].join('/');
    const url = new URL(`${path}?access_token=${this.accessToken}`, this.host);
    this.eventsSource = new Events(url.href);
    this.setOnMessageHandler(onMessageHandler);
    this.setOnErrorHandler();
  }

  public close() {
    this.eventsSource.close();
  }

  private setOnMessageHandler(onMessageHandler: (message) => void) {
    this.eventsSource.addEventListener(this.eventPrefix, onMessageHandler, false);
  }

  private setOnErrorHandler(): void {
    this.eventsSource.addEventListener('error', (error) => {
      this.close();

      if (error.readyState === Events.CLOSED) {
        throw new Error('Connection was closed!');
      }
      else {
        throw new Error('Something bad happened/Could not connect!');
      }
    }, false);
  }

  public requestAlarmState() {
    const url = new URL(`v1/devices/events`, this.host);

    const body = [
      'name=alarmStateRequest',
      'data=',
      'private=true',
      'ttl=60',
      `access_token=${this.accessToken}`
    ].join('&');

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    };

    return retryFetch(url, options, 3);
  }
}
