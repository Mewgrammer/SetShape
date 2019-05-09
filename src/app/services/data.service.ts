import { Injectable } from '@angular/core';
import {ITrainingDay, ITrainingPlan, IWorkout, IWorkoutHistoryItem} from '../resources/models/interfaces';
import {TestData} from '../resources/testdata';
import {DatabaseService} from './database.service';
import {TrainingDay, TrainingPlan, Workout, WorkoutHistoryItem} from '../resources/models/entities';
import {DataFactory} from '../resources/factory';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _trainingPlans: TrainingPlan[] = [];
  private _currentTrainingPlan: TrainingPlan;
  private _workoutHistory: WorkoutHistoryItem[];
  private _workouts: Workout[];

  public get TrainingPlans() {
    return [...this._trainingPlans];
  }

  public get CurrentTrainingPlan() {
    return this._currentTrainingPlan == null ? null : {...this._currentTrainingPlan};
  }

  public get Workouts() {
    return [...this._workouts];
  }

  public get WorkoutHistory() {
    return [...this._workoutHistory];
  }

  constructor(private _databaseService: DatabaseService) {
    this._trainingPlans = [TestData.plan];
    this._currentTrainingPlan = this._trainingPlans[0];
    this._workoutHistory = TestData.history;
    this._workouts = TestData.workouts;
  }

  public addDayToCurrentTrainingPlan(day: ITrainingDay) {
    this._currentTrainingPlan.days.push(day);
  }

  public createTrainingPlan(plan: TrainingPlan) {
    this._trainingPlans.push(plan);
  }

  public changeTrainingPlan(plan: TrainingPlan) {
    this._currentTrainingPlan = {...plan};
    console.log("Current Trainingplan Changed", this._currentTrainingPlan);
  }

  public removeTrainingPlan(plan: TrainingPlan) {
    const matchingPlan = this._trainingPlans.find(p => p.id == plan.id);
    if(matchingPlan != null) {
      this._trainingPlans.splice(this._trainingPlans.indexOf(matchingPlan), 1);
      console.log("Removed Training", matchingPlan, this._trainingPlans);
      if(this._currentTrainingPlan.id == plan.id) {
        this._currentTrainingPlan = null;
      }
    }
  }

  public removeTrainingDay(day: TrainingDay) {
    const matchingDay = this._currentTrainingPlan.days.find(d => d.id == day.id);
    if(matchingDay != null) {
      this._currentTrainingPlan.days.splice(this._currentTrainingPlan.days.indexOf(matchingDay), 1);
      console.log("Removed TrainingDay", matchingDay, this._currentTrainingPlan.days);
    }
  }

  public removeHistoryItem(item: WorkoutHistoryItem) {
    const match = this._workoutHistory.find(i => i.Date == item.Date && i.workout.id == item.workout.id);
    if(match != null) {
      this._workoutHistory.splice(this._workoutHistory.indexOf(match), 1);
      console.log("Removed HistoryItem", match, this._workoutHistory);
    }
  }

  public removeWorkoutFromDay(workout: Workout, day: TrainingDay) {
    const matchingDay = this._currentTrainingPlan.days.find(d => d.id == day.id);
    if(matchingDay != null) {
      const dayIndex = this._currentTrainingPlan.days.indexOf(matchingDay);
      const matchingWorkout = this._currentTrainingPlan.days[dayIndex].workouts.find(w => w.id == workout.id);
      if(matchingWorkout) {
        const workoutIndex =  this._currentTrainingPlan.days[dayIndex].workouts.indexOf(matchingWorkout);
        this._currentTrainingPlan.days[dayIndex].workouts.splice(workoutIndex, 1);
        console.log("Removed Workout", workout,  this._currentTrainingPlan.days[dayIndex].workouts);
      }
    }
  }

  addHistoryItem(workout: Workout) {
    this._workoutHistory.push(DataFactory.createWorkoutHistoryItem(workout));
  }
}
