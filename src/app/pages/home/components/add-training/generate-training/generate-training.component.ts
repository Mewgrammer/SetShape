import { Component, OnInit } from '@angular/core';
import {ITrainingDay, TrainingDay} from '../../../../../resources/models/training-plan';
import {EWorkoutType, IWorkout} from '../../../../../resources/models/workout';
import {DataService} from '../../../../../services/data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-generate-training',
  templateUrl: './generate-training.component.html',
  styleUrls: ['./generate-training.component.scss'],
})
export class GenerateTrainingComponent implements OnInit {

  public name : string = "";
  public countDays : string = "";
  public days : TrainingDay[] = [];
  public selectedWorkouts: EWorkoutType[];
  public dayName: string;

  public get WorkoutTypeEnum() {
    return EWorkoutType;
  }

  public get WorkoutTypes() {
    return Object.keys(EWorkoutType).filter(Number);
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
    const workouts: IWorkout[] = this._dataService.Workouts.filter(w => this.selectedWorkouts.find(sw => <EWorkoutType>sw == w.type) != null);
    const newDay: ITrainingDay = new TrainingDay(this.dayName, workouts);
    console.log("New Day", newDay);
    this.days.push(newDay);
  }

  onCreateTraining() {

  }
}
