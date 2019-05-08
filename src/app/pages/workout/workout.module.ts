import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WorkoutPage } from './workout.page';
import {LongPressDirective} from '../../directives/long-press.directive';
import {HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {IonicGestureConfig} from '../../resources/GestureConfig';

const routes: Routes = [
  {
    path: ':type',
    component: WorkoutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
      WorkoutPage,
      LongPressDirective
  ],
  providers: [{provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig}],
})
export class WorkoutPageModule {}
