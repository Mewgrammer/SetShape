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
  private _currentTrainingPlan: TrainingPlan = null;
  private _workoutHistory: WorkoutHistoryItem[] = [];
  private _workouts: Workout[] = [];

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
    this.loadData();
  }

  public loadTestData() {
    this._trainingPlans = [TestData.plan];
    this._currentTrainingPlan = this._trainingPlans[0];
    this._workoutHistory = TestData.history;
    this._workouts = TestData.workouts;

  }

  public async loadData() {
    this._databaseService.dbReady.subscribe(async (status) => {
      await this.syncWithDatabase();
      console.log("Data Service ready");
    });
  }

  public async addDayToCurrentTrainingPlan(day: TrainingDay) {
    this._currentTrainingPlan.days.push(day);
    console.log("Adding Day:", day);
    await this._databaseService.addTrainingDay(day);
    // await this._databaseService.updateTrainingPlan(this._currentTrainingPlan);
    await this.syncWithDatabase();
  
  }

  public async createTrainingPlan(plan: TrainingPlan) {
    const addedPlan = await this._databaseService.addTrainingPlan(plan);
    this._trainingPlans.push(addedPlan);
    await this.syncWithDatabase();
  
  }

  public async changeTrainingPlan(plan: TrainingPlan) {
    console.log("Changing Active Trainingplan:", plan);
    if(this._currentTrainingPlan != null) {
      this._currentTrainingPlan.active = false;
      await this._databaseService.updateTrainingPlan(this._currentTrainingPlan);
    }
    plan.active = true;
    await this._databaseService.updateTrainingPlan(plan);
    this._currentTrainingPlan = {...plan};
    await this.syncWithDatabase();
    console.log("Current Trainingplan Changed", this._currentTrainingPlan);
  }

  public async removeTrainingPlan(plan: TrainingPlan) {
    const matchingPlan = this._trainingPlans.find(p => p.id == plan.id);
    if(matchingPlan != null) {
      const deleteResult = await this._databaseService.deleteTrainingPlan(plan);
      this._trainingPlans.splice(this._trainingPlans.indexOf(matchingPlan), 1);
      console.log("Removed Training", matchingPlan, this._trainingPlans);
      if(this._currentTrainingPlan.id == plan.id) {
        this._currentTrainingPlan = null;
      }
      await this.syncWithDatabase();
  
    }
  }

  public async removeTrainingDay(day: TrainingDay) {
    const matchingDay = this._currentTrainingPlan.days.find(d => d.id == day.id);
    if(matchingDay != null) {
      const deleteResult = await this._databaseService.deleteTrainingDay(day);
      this._currentTrainingPlan.days.splice(this._currentTrainingPlan.days.indexOf(matchingDay), 1);
      console.log("Removed TrainingDay", matchingDay, this._currentTrainingPlan.days);
      await this.syncWithDatabase();
  
    }
  }

  public async removeHistoryItem(item: WorkoutHistoryItem) {
    const match = this._workoutHistory.find(i => i.id == item.id);
    if(match != null) {
      const deleteResult = await this._databaseService.deleteHistoryItem(item);
      this._workoutHistory.splice(this._workoutHistory.indexOf(match), 1);
      console.log("Removed HistoryItem", match, this._workoutHistory);
      await this.syncWithDatabase();
  
    }
  }

  public async removeWorkoutFromDay(workout: Workout, day: TrainingDay) {
    const matchingDay = this._currentTrainingPlan.days.find(d => d.id == day.id);
    if(matchingDay != null) {
      const dayIndex = this._currentTrainingPlan.days.indexOf(matchingDay);
      const matchingWorkout = this._currentTrainingPlan.days[dayIndex].workouts.find(w => w.id == workout.id);
      if(matchingWorkout != null) {
        const workoutIndex =  this._currentTrainingPlan.days[dayIndex].workouts.indexOf(matchingWorkout);
        this._currentTrainingPlan.days[dayIndex].workouts.splice(workoutIndex, 1);
        const updateResult = await this._databaseService.updateTrainingPlan(this._currentTrainingPlan);
        console.log("Removed Workout", workout,  this._currentTrainingPlan.days[dayIndex].workouts);
        await this.syncWithDatabase();
  
      }
    }
  }

  public async addHistoryItem(workout: Workout) {
    const addedItem = await this._databaseService.addHistoryItem(DataFactory.createWorkoutHistoryItem(workout))
    this._workoutHistory.push(addedItem);
    await this.syncWithDatabase();
  }
  
  public async syncWithDatabase() {
    this._trainingPlans = await this._databaseService.TrainingPlans;
    this._currentTrainingPlan = await this._databaseService.ActivePlan;
    this._workoutHistory = await this._databaseService.History;
    this._workouts = await this._databaseService.Workouts;
    
    console.log("Sync DB Data");
  
    console.log("Workouts", this._workouts);
    console.log("Current Plan", this._currentTrainingPlan);
    console.log("Plans", this._trainingPlans);
    console.log("History", this._workoutHistory);
  
  
  }
}
