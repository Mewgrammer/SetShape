import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {DataService} from './services/data.service';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  
  public databaseReady = false;
  
  public get LoggedIn() {
    return this._dataService.LoggedIn;
  }

  constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, private _dataService: DataService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
