import { Component } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class App {
  rootPage:any = TabsPage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              push: Push,
              alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      push.hasPermission().then((res: any) => {
        if (!res.isEnabled)  {
          alertCtrl.create({
            title: 'Notificaciones push',
            subTitle: '¡No te olvides de habilitar las notificaciones push! Ve a los ajustes de ' +
            'tu dispositivo para que habilites las notificaciones si no lo has hecho.',
            buttons: [ 'De acuerdo' ]
          }).present();
        }
      }).then(() => {
        const options: PushOptions = {
          android: {},
          ios: {
            alert: 'true',
            badge: true,
            sound: 'false'
          },
          windows: {},
          browser: {
            pushServiceURL: 'http://push.api.phonegap.com/v1/push'
          }
        };

        const pushObj: PushObject = push.init(options);
      });
    });
  }
}
