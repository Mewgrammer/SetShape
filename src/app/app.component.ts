import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {DatabaseService} from './services/database.service';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  
  public databaseReady = false;

  constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, private _dbService: DatabaseService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
    this._dbService.dbReady.subscribe( () => {
      this.databaseReady = true;
      this.splashScreen.hide();
    });
  }
}
