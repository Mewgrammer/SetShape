import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TrainingPlanPage } from './training-plan.page';
import {TrainingPlanComponent} from '../../components/training-plan/training-plan.component';
import {TimerComponent} from '../../components/timer/timer.component';
import {TrainingHistoryComponent} from '../../components/training-history/training-history.component';
import {TrainingHistoryItemComponent} from '../../components/training-history/training-history-item/training-history-item.component';
import {CounterComponent} from '../../components/counter/counter.component';

const routes: Routes = [
  {
    path: '',
    component: TrainingPlanPage,
    children: [
      {
        path: 'trainings',
        component: TrainingPlanComponent
      },
      {
        path: 'history',
        component: TrainingHistoryComponent
      },
      {
        path: 'timer',
        component: TimerComponent
      },
      {
        path: 'counter',
        component: CounterComponent
      },
    ],
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
      CounterComponent,
      TrainingPlanPage,
      TrainingPlanComponent,
      TimerComponent,
      TrainingHistoryComponent,
      TrainingHistoryItemComponent,
  ]
})
export class TrainingPlanPageModule {}
