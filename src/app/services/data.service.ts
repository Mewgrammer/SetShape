import { Injectable } from '@angular/core';
import {ITrainingDay, ITrainingPlan} from '../resources/models/training-plan';
import {TestData} from '../resources/testdata';
import {IWorkout, IWorkoutHistoryItem} from '../resources/models/workout';

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

  addHistoryItem(workout: IWorkout) {
    this._workoutHistory.push({
      date: new Date(),
      workout: {...workout}
    });
  }
}
