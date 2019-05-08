import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {TrainingPlan} from '../../../../resources/models/training-plan';
import {DataService} from '../../../../services/data.service';

@Component({
  selector: 'app-change-training',
  templateUrl: './change-training.component.html',
  styleUrls: ['./change-training.component.scss'],
})
export class ChangeTrainingComponent implements OnInit {

  public trainings: TrainingPlan[] = [];

  public get Trainings() {
    return this._dataService.TrainingPlans;
  }

  constructor(private _dataService: DataService, private _router: Router,) { }

  ngOnInit() {
    this.trainings = this._dataService.TrainingPlans;
  }

  async onSelectTraining(training: TrainingPlan) {
    this._dataService.changeTrainingPlan(training);
  }

  async onCreateNewTraining() {
    await this._router.navigateByUrl("/create");
  }

}
