import { retryFetch } from '../utils/retryFetch.js';
import { AlarmSystemBackend, AreaAvailability } from './AlarmSystemService';

const Events = window['EventSource'];

export class ParticleCloudService implements AlarmSystemBackend {

  private eventsSource;

  private host: string;

  private accessToken: string;

  private deviceId: string;

  constructor(host: string,
              accessToken: string,
              deviceId: string) {
    this.host = host;

    this.accessToken = accessToken;

    this.deviceId = deviceId;
  }

  public open(): void {
    const path =[
      'v1',
      'events',
      'systemState'
    ].join('/');

    const url = new URL(`${path}?access_token=${this.accessToken}`, this.host);

    this.eventsSource = new Events(url.href);

    this.setOnErrorHandler();
  }

  public close() {
    this.eventsSource.close();
  }

  public onSystemState(handler: (object) => void): void {
    this.setOnMessageHandler('systemState', handler);
  }

  public getSystemState(): Promise<any> {
    const urlPath = [
      'v1',
      'devices',
      `${this.deviceId}`,
      'systemState',
    ].join('/');

    const url = new URL(`${urlPath}?access_token=${this.accessToken}`, this.host);

    const options = {
      method: 'GET'
    };

    return retryFetch(url, options, 3).then(r => r.json());
  }

  public activateSystem(areas: Array<AreaAvailability>): Promise<any> {
    const url = new URL('v1/devices/events', this.host);

    const body = [
      'name=activateSystem',
      `data=${areas.map(area => `${area.number}${area.isDisabled ? 'd' : 'e'}` ).join('-')}`,
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

  public deactivateSystem(): Promise<any> {
    const url = new URL('v1/devices/events', this.host);

    const body = [
      'name=deactivateSystem',
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

  private setOnMessageHandler(prefix, onMessageHandler: (message) => void): void {
    this.eventsSource.addEventListener(prefix, onMessageHandler, false);
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
}
