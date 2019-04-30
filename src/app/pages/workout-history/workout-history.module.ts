import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WorkoutHistoryPage } from './workout-history.page';

const routes: Routes = [
  {
    path: ':type',
    component: WorkoutHistoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WorkoutHistoryPage]
})
export class WorkoutHistoryPageModule {}
