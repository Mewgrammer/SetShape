import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../../../services/data.service';
import {Router} from '@angular/router';
import {TrainingDay, TrainingDayWorkout, Workout} from '../../../../../resources/ApiClient';
import {DataFactory} from '../../../../../resources/factory';

@Component({
  selector: 'app-generate-training',
  templateUrl: './generate-training.component.html',
  styleUrls: ['./generate-training.component.scss'],
})
export class GenerateTrainingComponent implements OnInit {

  public name : string = "";
  public countDays : string = "";
  public days : TrainingDay[] = [];
  public selectedWorkouts: Workout[];
  public dayName: string;
  
  public get Workouts() {
    return this._dataService.Workouts;
  }
  public get InputsValid() {
    return this.dayName != null && this.dayName.length > 0 && this.selectedWorkouts != null && this.selectedWorkouts.length > 0;
  }

  constructor(private _dataService: DataService, private _router: Router,) { }

  ngOnInit() {}

  removeDay(day: TrainingDay) {
    this.days.splice(this.days.indexOf(day), 1);
  }

  onAddDayClick() {
    const newDay = DataFactory.createTrainingDay(this.dayName, this.selectedWorkouts);
    console.log("New Day", newDay);
    this.days.push(newDay);
  }

  async onCreateTraining() {
    await this._router.navigateByUrl("/change");
  }
}
