import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TrainingDayPage } from './training-day.page';
import {TrainingDayPopoverComponent} from './components/training-day-popover/training-day-popover.component';
import {AddWorkoutComponent} from './components/add-workout/add-workout.component';

const routes: Routes = [
  {
    path: ':id',
    component: TrainingDayPage
  },
  {
    path: ':id/create',
    component: AddWorkoutComponent
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
    TrainingDayPage,
    AddWorkoutComponent,
    TrainingDayPopoverComponent,
  ],
  entryComponents: [
    TrainingDayPopoverComponent
  ],
})
export class TrainingDayPageModule {}
