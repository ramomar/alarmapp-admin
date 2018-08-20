import { Network } from '@ionic-native/network';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Platform } from 'ionic-angular';

@Injectable()
export class NetworkService {

  private networkUpdateSource: Subject<NetworkUpdate>;

  public readonly networkUpdate$: Observable<NetworkUpdate>;

  private previousIsDisconnected: boolean;

  constructor(private platform: Platform,
              private network: Network) {
    this.networkUpdateSource = new Subject<NetworkUpdate>();

    this.networkUpdate$ = this.networkUpdateSource.asObservable();

    this.platform.ready().then(() => {
      this.init();
    })
  }

  private init(): void {
    this.previousIsDisconnected = this.isDisconnected();

    // There is a bug with this plugin.
    // Disconnect event fires two times on android.
    // I'm going to try with set interval.
    setInterval(() => {
      const currentIsDisconnected = this.isDisconnected();

      if (this.previousIsDisconnected != currentIsDisconnected) {
        this.networkUpdateSource.next(new NetworkUpdate(!currentIsDisconnected));
      }

      this.previousIsDisconnected = currentIsDisconnected;
    }, 1000);

    this.network.onchange().subscribe(() => {});
  }

  public isDisconnected(): boolean {
    return this.network.type === 'none';
  }
}

export class NetworkUpdate {

  constructor(readonly isOnline: boolean) {

  }
}
