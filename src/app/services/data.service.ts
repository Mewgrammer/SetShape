import { Injectable } from '@angular/core';
import {ITrainingDay, ITrainingPlan, TrainingDay} from '../resources/models/training-plan';
import {TestData} from '../resources/testdata';
import {IWorkout, IWorkoutHistoryItem} from '../resources/models/workout';
import {workflow} from '@angular-devkit/schematics';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _trainingPlans: ITrainingPlan[] = [];
  private _currentTrainingPlan: ITrainingPlan;
  private _workoutHistory: IWorkoutHistoryItem[];
  private _workouts: IWorkout[];

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

  constructor() {
    this._trainingPlans = [TestData.plan];
    this._currentTrainingPlan = this._trainingPlans[0];
    this._workoutHistory = TestData.history;
    this._workouts = TestData.workouts;
  }

  public addDayToCurrentTrainingPlan(day: ITrainingDay) {
    this._currentTrainingPlan.days.push(day);
  }

  public createTrainingPlan(plan: ITrainingPlan) {
    this._trainingPlans.push(plan);
  }

  public changeTrainingPlan(plan: ITrainingPlan) {
    this._currentTrainingPlan = {...plan};
    console.log("Current Trainingplan Changed", this._currentTrainingPlan);
  }

  public removeTrainingPlan(plan: ITrainingPlan) {
    const matchingPlan = this._trainingPlans.find(p => p.id == plan.id);
    if(matchingPlan != null) {
      this._trainingPlans.splice(this._trainingPlans.indexOf(matchingPlan), 1);
      console.log("Removed Training", matchingPlan, this._trainingPlans);
      if(this._currentTrainingPlan.id == plan.id) {
        this._currentTrainingPlan = null;
      }
    }
  }

  public removeTrainingDay(day: ITrainingDay) {
    const matchingDay = this._currentTrainingPlan.days.find(d => d.id == day.id);
    if(matchingDay != null) {
      this._currentTrainingPlan.days.splice(this._currentTrainingPlan.days.indexOf(matchingDay), 1);
      console.log("Removed TrainingDay", matchingDay, this._currentTrainingPlan.days);
    }
  }

  public removeWorkoutFromDay(workout: IWorkout, day: ITrainingDay) {
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

  addHistoryItem(workout: IWorkout) {
    this._workoutHistory.push({
      date: new Date(),
      workout: {...workout}
    });
  }
}
