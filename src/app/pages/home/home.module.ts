import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {RouterModule, Routes} from '@angular/router';
import { HomePage } from './home.page';
import {AddTrainingComponent} from './components/add-training/add-training.component';
import {TrainingsPopoverComponent} from './components/trainings-popover/trainings-popover.component';
import {ChangeTrainingComponent} from './components/change-training/change-training.component';
import {AddTrainingDayComponent} from './components/add-training-day/add-training-day.component';
import {AddTrainingManualComponent} from './components/add-training/add-training-manual/add-training-manual.component';
import {GenerateTrainingComponent} from './components/add-training/generate-training/generate-training.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'add',
    component: AddTrainingDayComponent,
  },
  {
    path: 'create',
    component: AddTrainingComponent,
  },
  {
    path: 'create/manual',
    component: AddTrainingManualComponent,
  },
  {
    path: 'create/generate',
    component: GenerateTrainingComponent,
  },
  {
    path: 'change',
    component: ChangeTrainingComponent,
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
    HomePage,
    AddTrainingComponent,
    AddTrainingManualComponent,
    AddTrainingDayComponent,
    ChangeTrainingComponent,
    GenerateTrainingComponent,
    TrainingsPopoverComponent,
  ],
  entryComponents: [
    TrainingsPopoverComponent,
  ]
})
export class HomePageModule {}
