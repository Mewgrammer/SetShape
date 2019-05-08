import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../../../../services/data.service';
import {TrainingPlan} from '../../../../resources/models/entities';

@Component({
  selector: 'app-change-training',
  templateUrl: './change-training.component.html',
  styleUrls: ['./change-training.component.scss'],
})
export class ChangeTrainingComponent implements OnInit {

  public get Trainings() {
    return this._dataService.TrainingPlans;
  }

  constructor(private _dataService: DataService, private _router: Router,) { }

  ngOnInit() {
  }

  async onSelectTraining(training: TrainingPlan) {
    this._dataService.changeTrainingPlan(training);
    await this._router.navigateByUrl("/");
  }

  async onCreateNewTraining() {
    await this._router.navigateByUrl("/create");
  }

  removeTraining(training: TrainingPlan) {
    this._dataService.removeTrainingPlan(training);
  }
}
