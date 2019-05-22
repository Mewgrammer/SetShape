import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {CounterComponent} from './components/counter/counter.component';
import {SQLite} from '@ionic-native/sqlite/ngx';

@NgModule({
  declarations: [
      AppComponent,
      CounterComponent,
  ],
  entryComponents: [],
  imports: [
      BrowserModule,
      IonicModule.forRoot( {swipeBackEnabled: true}),
      AppRoutingModule
  ],
  providers: [
      StatusBar,
      SplashScreen,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      SQLite,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
