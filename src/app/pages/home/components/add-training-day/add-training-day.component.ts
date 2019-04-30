import { Component, OnInit } from '@angular/core';
import {EWorkoutType, IWorkout, Workout} from '../../../../resources/models/workout';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {DataService} from '../../../../services/data.service';
import {ITrainingDay, TrainingDay} from '../../../../resources/models/training-plan';

@Component({
  selector: 'app-add-training-day',
  templateUrl: './add-training-day.component.html',
  styleUrls: ['./add-training-day.component.scss'],
})
export class AddTrainingDayComponent implements OnInit {
  selectedWorkouts: EWorkoutType[];
  name: string;

  public get WorkoutTypeEnum() {
    return EWorkoutType;
  }

  public get WorkoutTypes() {
    return Object.keys(EWorkoutType).filter(Number);
  }

  constructor(private _dataService: DataService, private router: Router) { }

  ngOnInit() {

  }

  async onAddDayClick() {
    console.log("Name",this.name);
    console.log("Selected Workouts", this.selectedWorkouts);
    const workouts: IWorkout[] = this._dataService.Workouts.filter(w => this.selectedWorkouts.find(sw => <EWorkoutType>sw == w.type) != null);
    console.log("Workouts", workouts);
    const newDay: ITrainingDay = new TrainingDay(this.name, workouts);
    console.log("New Day", newDay);
    this._dataService.addDayToCurrentTrainingPlan(newDay);
    await this.router.navigateByUrl("/");
  }
}
