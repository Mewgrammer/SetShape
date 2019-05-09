import { Injectable } from '@angular/core';
import {SQLiteObject} from '@ionic-native/sqlite';
import {BehaviorSubject} from 'rxjs';
import {Platform, ToastController} from '@ionic/angular';
import {SQLite} from '@ionic-native/sqlite/ngx';
import {ITrainingDay, ITrainingPlan, IWorkout, IWorkoutHistoryItem} from '../resources/models/interfaces';
import {Connection, createConnection, getRepository, Repository} from 'typeorm';
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

  private _trainingDays: Promise<TrainingDay[]>;
  private _history: Promise<WorkoutHistoryItem[]>;
  private _workouts:  Promise<Workout[]>;
  private _trainingPlans:  Promise<TrainingPlan[]>;

  constructor(private _plt: Platform, private toastController: ToastController) {
    this._plt.ready().then( async () => {
      // Depending on the machine the app is running on, configure
      // different database connections
      if (this._plt.is('cordova')) {
        console.log("Platform is Cordova");
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
        console.log("Platform is not Cordova");
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

  private async loadHistory(): Promise<WorkoutHistoryItem[]> {
    const history: WorkoutHistoryItem[] = [];
    const historyRepo = getRepository("history") as Repository<WorkoutHistoryItem>;
    const loadedHistory = await historyRepo.createQueryBuilder('history')
        .innerJoinAndSelect('history.workout', 'workout')
        .getMany();
    console.log("History loaded from DB:", historyRepo, loadedHistory);
    return history;
  }

  private async loadWorkouts(): Promise<Workout[]> {
    const workoutRepo = getRepository("workout") as Repository<Workout>;
    const workouts = workoutRepo.find();
    console.log("Workouts loaded from DB:", workoutRepo, workouts);
    return [];
  }

  private async loadTrainingPlans(): Promise<TrainingPlan[]> {
    const trainingPlans: ITrainingPlan[] = [];
    return trainingPlans;
  }

  private async loadTrainingDays(): Promise<TrainingDay[]> {
    const trainingDays: ITrainingDay[] = [];
    return trainingDays;
  }

  public async addHistoryItem(item: WorkoutHistoryItem) {
    return [];
  }

  public async deleteHistoryItem(item: WorkoutHistoryItem) {

  }

  public async addTrainingPlan(plan: TrainingPlan) {

  }

  public async deleteTrainingPlan(plan: TrainingPlan) {

  }

  public async addTrainingDay(plan: TrainingPlan) {

  }

  public async deleteTrainingDay(plan: TrainingPlan) {

  }

  public async addWorkout(workout: IWorkout) {

  }

}
