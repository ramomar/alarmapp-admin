import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AlarmSystemService} from "../../services/AlarmSystemService";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController,
              private alarmSystemService: AlarmSystemService) {

  }

  private testSirenButton(): void {
    this.alarmSystemService.testSiren(1000);
  }
}
