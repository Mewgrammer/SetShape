import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {DataService} from '../../../../services/data.service';
import {EWorkoutType, ITrainingDay, IWorkout} from '../../../../resources/models/interfaces';
import {TrainingDay, Workout} from '../../../../resources/models/entities';
import {DataFactory} from '../../../../resources/factory';

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

  public get InputsValid() {
    return this.name != null && this.name.length > 0 && this.selectedWorkouts != null && this.selectedWorkouts.length > 0;
  }

  constructor(private _dataService: DataService, private router: Router) { }

  ngOnInit() {

  }

  async onAddDayClick() {
    console.log("Name",this.name);
    console.log("Selected Workouts", this.selectedWorkouts);
    const workouts: Workout[] = this._dataService.Workouts.filter(w => this.selectedWorkouts.find(sw => <EWorkoutType>sw == w.type) != null);
    console.log("Matching Workouts:", workouts, this._dataService.Workouts);
    let newDay = DataFactory.createTrainingDay(this.name, workouts);
    console.log("New Day To Add:", newDay);
    this._dataService.addDayToCurrentTrainingPlan(newDay);
    await this.router.navigateByUrl("/");
  }
}
