import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StatisticsPage } from './statistics.page';
import {TrainingDayPage} from '../training-day/training-day.page';

const routes: Routes = [
  {
    path: '',
    component: StatisticsPage
  },
  {
    path: ':id',
    component: StatisticsPage
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StatisticsPage]
})
export class StatisticsPageModule {}
