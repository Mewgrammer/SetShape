import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../../../services/data.service';
import {Router} from '@angular/router';
import {EWorkoutType, ITrainingDay, IWorkout} from '../../../../../resources/models/interfaces';
import {TrainingDay, Workout} from '../../../../../resources/models/entities';

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
    const workouts: Workout[] = this._dataService.Workouts.filter(w => this.selectedWorkouts.find(sw => <EWorkoutType>sw == w.type) != null);
    const newDay: TrainingDay = new TrainingDay();
    newDay.name = this.dayName;
    newDay.workouts = workouts;
    console.log("New Day", newDay);
    this.days.push(newDay);
  }

  async onCreateTraining() {
    await this._router.navigateByUrl("/change");
  }
}
