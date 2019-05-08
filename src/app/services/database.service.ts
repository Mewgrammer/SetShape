import { Injectable } from '@angular/core';
import {SQLiteObject} from '@ionic-native/sqlite';
import {BehaviorSubject} from 'rxjs';
import {Platform, ToastController} from '@ionic/angular';
import {SQLite} from '@ionic-native/sqlite/ngx';
import {ITrainingDay, ITrainingPlan, IWorkout, IWorkoutHistoryItem} from '../resources/models/interfaces';
import {Connection, createConnection} from 'typeorm';
import {TrainingDay, TrainingPlan, Workout, WorkoutHistoryItem} from '../resources/models/entities';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private _db: SQLiteObject;

  public dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public get History() {
    if(this._history == null) {
      this._history = this.loadHistory();
    }
    return this._history;
  }

  public get TrainingDays() {
    if(this._trainingDays == null) {
      this._trainingDays = this.loadTrainingDays();
    }
    return this._trainingDays;
  }

  public get Workouts() {
    if(this._workouts == null) {
      this._workouts = this.loadWorkouts();
    }
    return this._workouts;
  }

  public get TrainingPlans() {
    if(this._trainingPlans == null) {
      return this.loadTrainingPlans();
    }
    return this._trainingPlans;
  }

  private _connection: Connection;

  private _trainingDays: Promise<ITrainingDay[]>;
  private _history: Promise<IWorkoutHistoryItem[]>;
  private _workouts:  Promise<IWorkout[]>;
  private _trainingPlans:  Promise<ITrainingPlan[]>;

  constructor(private _plt: Platform, private toastController: ToastController) {
    this._plt.ready().then( async () => {
      // Depending on the machine the app is running on, configure
      // different database connections
      if (this._plt.is('cordova')) {
        // Running on device or emulator
        this._connection = await createConnection({
          type: 'cordova',
          database: 'set_shape',
          location: 'default',
          logging: ['error', 'query', 'schema'],
          synchronize: true,
          entities: [
            Workout,
            TrainingDay,
            TrainingPlan,
            WorkoutHistoryItem,
          ]
        });
      } else {
        // Running app in browser
        this._connection = await createConnection({
          type: 'sqljs',
          autoSave: true,
          location: 'browser',
          logging: ['error', 'query', 'schema'],
          synchronize: true,
          entities: [
            Workout,
            TrainingDay,
            TrainingPlan,
            WorkoutHistoryItem,
          ]
        });
      }
      console.log("Database Connection:", this._connection);
      const toast = await this.toastController.create({
        message: 'Db Connection established!',
        duration: 2000
      });
      toast.present();

    }).catch( async  (err) => {
      const toast = await this.toastController.create({
        message: 'Db Connection failed!',
        duration: 2000
      });
      toast.present();
      console.error("Failed to created Database", err);
    });
  }

  private async connectDatabase() {

  }

  private async loadHistory(): Promise<IWorkoutHistoryItem[]> {
    const history: IWorkoutHistoryItem[] = [];
    try {
      const queryResult = await this._db.executeSql("Select * FROM history", []);
      if (queryResult.rows.length > 0) {

      }
    }
    catch (e) {
      console.error("Retrieving History from Database failed", e);
    }
    return history;
  }

  private async loadWorkouts(): Promise<IWorkout[]> {
    const history: IWorkoutHistoryItem[] = [];
    return [];
  }

  private async loadTrainingPlans(): Promise<ITrainingPlan[]> {
    const trainingPlans: ITrainingPlan[] = [];
    return trainingPlans;
  }

  private async loadTrainingDays(): Promise<ITrainingDay[]> {
    const trainingDays: ITrainingDay[] = [];
    return trainingDays;
  }

  public async addHistoryItem(item: IWorkoutHistoryItem) {
    return [];
  }

  public async deleteHistoryItem(item: IWorkoutHistoryItem) {

  }

  public async addTrainingPlan(plan: ITrainingPlan) {

  }

  public async deleteTrainingPlan(plan: ITrainingPlan) {

  }

  public async addTrainingDay(plan: ITrainingPlan) {

  }

  public async deleteTrainingDay(plan: ITrainingPlan) {

  }

  public async addWorkout(workout: IWorkout) {

  }

}
