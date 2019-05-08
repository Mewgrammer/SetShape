import { Component, OnInit } from '@angular/core';
import {ITrainingDay, TrainingDay, TrainingPlan} from '../../../../../resources/models/training-plan';
import {EWorkoutType, IWorkout} from '../../../../../resources/models/workout';
import {Router} from '@angular/router';
import {DataService} from '../../../../../services/data.service';

@Component({
  selector: 'app-add-training-manual',
  templateUrl: './add-training-manual.component.html',
  styleUrls: ['./add-training-manual.component.scss'],
})
export class AddTrainingManualComponent implements OnInit {

  public name : string = "";
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

  async onCreateTraining() {
    if(this.name && this.name.length > 0) {
      const newTrainingPlan = new TrainingPlan(this.name, this.days);
      this._dataService.createTrainingPlan(newTrainingPlan);
      await this._router.navigateByUrl("/change");
    }
  }
}
