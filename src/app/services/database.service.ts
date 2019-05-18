import { Injectable } from '@angular/core';
import {SQLiteObject} from '@ionic-native/sqlite';
import {BehaviorSubject} from 'rxjs';
import {Platform, ToastController} from '@ionic/angular';
import {Connection, createConnection, getRepository, Repository} from 'typeorm';
import {TrainingDay, TrainingPlan, Workout, WorkoutHistoryItem} from '../resources/models/entities';
import {TestData} from '../resources/testdata';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  private _connection: Connection;
  private _trainingDays: Promise<TrainingDay[]>;
  private _history: Promise<WorkoutHistoryItem[]>;
  private _workouts:  Promise<Workout[]>;
  private _activeTrainingPlan:  Promise<TrainingPlan>;
  private _trainingPlans:  Promise<TrainingPlan[]>;
  
  public dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  private get Connected() {
    return this._connection != null && this._connection.isConnected && this._connection.manager != null;
  }
  
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
      this._trainingPlans = this.loadTrainingPlans();
    }
    return this._trainingPlans;
  }

  public get ActivePlan() {
    if(this._activeTrainingPlan == null)
      this._activeTrainingPlan = this.findActiveTrainingPlan();
    return this._activeTrainingPlan;
  }


  constructor(private _plt: Platform, private toastController: ToastController) {
    this._plt.ready().then( async () => {
      // Depending on the machine the app is running on, configure
      // different database connections
      if (this._plt.is('cordova')) {
        console.log("Platform is Cordova");
        // Running on device or emulator
        this._connection = await createConnection({
          name: "default",
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
        this.loadData().then(() => {
          console.log("Database Ready");
          this.dbReady.next(true);
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
        message: 'Db Connection failed! ' + err.message,
        duration: 2000
      });
      toast.present();
      console.error("Failed to created Database", err);
    });
  }
  


  private async loadData() {
    try {
      if(!this.Connected) {
        console.log("DB not connected - retrying to load data in 5 seconds...");
        setTimeout(() => this.loadData(), 5000);
        return;
      }
      console.log("Loading Data...");
      let workouts = await this._connection.manager.find(Workout);
      if(workouts.length == 0) {
        console.log("Adding default Workouts to Database...");
        await this.addWorkouts(TestData.workouts);
        console.log("Added default Workouts");
      }
      workouts = await this.loadWorkouts();
      const history = await this.loadHistory();
      const days = await this.loadTrainingDays();
      const plans = await this.loadTrainingPlans();
      this._activeTrainingPlan = this.findActiveTrainingPlan();
  
      console.log("DB: Workouts", workouts);
      console.log("DB: Days", days);
      console.log("DB: Plans", plans);
      console.log("DB: History", history);
    }
    catch (e) {
      console.error(e);
    }
  }

  // *****************************************************************************
  // History Item
  // *****************************************************************************
  private async loadHistory(): Promise<WorkoutHistoryItem[]> {
    if(!this.Connected) return  [];
    const repo = getRepository("history") as Repository<WorkoutHistoryItem>;
    this._history = repo.find({relations: ["workout"]});
    // this._history = this._connection.manager.find(WorkoutHistoryItem, { relations: ["workout"]});
  
    return this._history;
  }
  public async addHistoryItem(item: WorkoutHistoryItem): Promise<WorkoutHistoryItem> {
    if(!this.Connected) return null;
    item.id = undefined; // Make sure Id is not set - it will be auto-generated
    console.log("DB: adding History Item", item);
    const repo = getRepository("history") as Repository<WorkoutHistoryItem>;
    const addResult = await repo.save(item);
    console.log("DB: WorkoutHistoryItem added", addResult);
    this._history = this.loadHistory();
    return addResult;
  }
  public async addHistoryItems(items: WorkoutHistoryItem[]) {
    if(!this.Connected) return null;
    items = items.map(w => {
      w.id = undefined;
      return w;
    });
    const repo = getRepository("history") as Repository<WorkoutHistoryItem>;
    const addResult = await repo.save(items);
    console.log("DB: WorkoutHistoryItem added", addResult);
    this._history = this.loadHistory();
    return addResult;
  }
  public async updateHistoryItem(updatedDay: TrainingDay) {
    if(!this.Connected) return null;
    const repo = getRepository("history") as Repository<WorkoutHistoryItem>;
    const updateResult = await repo.save(updatedDay);
    console.log("DB: TrainingDay updated:", updateResult);
    this._history = this.loadHistory();
  }
  public async deleteHistoryItem(item: WorkoutHistoryItem) {
    if(!this.Connected) return null;
    const repo = getRepository("history") as Repository<WorkoutHistoryItem>;
    const deleteResult = await repo.delete({id: item.id});
    console.log("DB: WorkoutHistoryItem deleted", deleteResult);
    this._history = this.loadHistory();
  
    return  deleteResult;
  }

  // *****************************************************************************
  // Training Plan
  // *****************************************************************************
  private async loadTrainingPlans(): Promise<TrainingPlan[]> {
    if(!this.Connected) return  [];
    const repo = getRepository("trainingPlan") as Repository<TrainingPlan>;
    this._trainingPlans = repo.find({relations: ["days", "days.workouts"]});
    // this._trainingPlans = this._connection.manager.find(TrainingPlan, { relations: ["days"]});
    return this._trainingPlans;
  }
  private async findActiveTrainingPlan(): Promise<TrainingPlan> {
    if(!this.Connected) return null;
    console.log("Find Active TrainingPlan");
    const repo = getRepository("trainingPlan") as Repository<TrainingPlan>;
    return await repo.findOne({active: true}, { relations: ["days", "days.workouts"]});
  }
  public async addTrainingPlan(plan: TrainingPlan): Promise<TrainingPlan> {
    if(!this.Connected) return null;
    plan.id = undefined; // Make sure Id is not set - it will be auto-generated
    const repo = getRepository("trainingPlan") as Repository<TrainingPlan>;
    const addedEntity = await repo.save(plan);
    console.log("DB: TrainingPlan added", addedEntity);
    this._trainingPlans = this.loadTrainingPlans();
    return addedEntity;
  }
  public async addTrainingPlans(plans: TrainingPlan[]) {
    if(!this.Connected) return null;
    plans = plans.map(w => {
      w.id = undefined;
      return w;
    });
    const repo = getRepository("trainingPlan") as Repository<TrainingPlan>;
    const addResult = await repo.save(plans);
    console.log("DB:  TrainingPlan added", addResult);
    this._trainingPlans = this.loadTrainingPlans();
    return addResult;
  }
  public async updateTrainingPlan(updatedPlan: TrainingPlan) {
    if(!this.Connected) return null;
    const repo = getRepository("trainingPlan") as Repository<TrainingPlan>;
    const updateResult = await repo.save(updatedPlan);
    console.log("DB:  TrainingPlan updated:", updateResult);
    this._trainingPlans = this.loadTrainingPlans();
    this._activeTrainingPlan = this.findActiveTrainingPlan();
  }
  public async deleteTrainingPlan(plan: TrainingPlan) {
    if(!this.Connected) return null;
    const repo = getRepository("trainingPlan") as Repository<TrainingPlan>;
    const deleteResult = repo.delete({id : plan.id});
    console.log("DB:  TrainingPlan deleted", deleteResult);
    this._trainingPlans = this.loadTrainingPlans();
    return  deleteResult;

  }
  
  // *****************************************************************************
  // Training Day
  // *****************************************************************************
  private async loadTrainingDays(): Promise<TrainingDay[]> {
    if(!this.Connected) return  [];
    // this._trainingDays = this._connection.manager.find(TrainingDay, { relations: ["workouts"]});
    const repo = getRepository("trainingDay") as Repository<TrainingDay>;
    this._trainingDays = repo.find({relations: ["workouts"]});
  
    return this._trainingDays;
  }
  public async addTrainingDay(day: TrainingDay) {
    if(!this.Connected) return null;
    day.id = undefined; // Make sure Id is not set - it will be auto-generated
    const repo = getRepository("trainingDay") as Repository<TrainingDay>;
    const addResult = await repo.save(day);
    console.log("DB: TrainingDay added", addResult);
    this._trainingDays = this.loadTrainingDays();
    return addResult;
  }
  public async addTrainingDays(days: TrainingDay[]) {
    if(!this.Connected) return null;
    days = days.map(w => {
      w.id = undefined;
      return w;
    });
    const repo = getRepository("trainingDay") as Repository<TrainingDay>;
    const addResult = await repo.save(days);
    console.log("DB: TrainingDays added", addResult);
    this._trainingDays = this.loadTrainingDays();
    return addResult;
  }
  public async updateTrainingDay(updatedDay: TrainingDay) {
    if(!this.Connected) return null;
    const repo = getRepository("trainingDay") as Repository<TrainingDay>;
    const updateResult = await repo.save(updatedDay);
    console.log("DB: TrainingDay updated: ", updateResult);
    this._trainingDays = this.loadTrainingDays();
  }
  public async deleteTrainingDay(day: TrainingDay) {
    if(!this.Connected) return null;
    const repo = getRepository("trainingDay") as Repository<TrainingDay>;
    const deleteResult = repo.delete({id : day.id});
    console.log("DB: TrainingDay deleted", deleteResult);
    this._trainingDays = this.loadTrainingDays();
    return  deleteResult;
  }

  // *****************************************************************************
  // Workout
  // *****************************************************************************
  private async loadWorkouts(): Promise<Workout[]> {
    if(!this.Connected) return [];
  
    const repo = getRepository("workout") as Repository<Workout>;
    this._workouts = repo.find();
  
    // this._workouts = this._connection.manager.find(Workout);
    return this._workouts;
  }
  public async addWorkout(workout: Workout) {
    if(!this.Connected) return null;
    workout.id = undefined; // Make sure Id is not set - it will be auto-generated
    const repo = getRepository("workout") as Repository<Workout>;
    const addResult = await repo.save(workout);
    console.log("DB: Workout added", addResult);
    this._workouts = this.loadWorkouts();
    return addResult;
  }
  public async addWorkouts(workouts: Workout[]) {
    if(!this.Connected) return null;
    workouts = workouts.map(w => {
      w.id = undefined;
      return w;
    });
    console.log("Adding Workouts:", workouts);
    const repo = getRepository("workout") as Repository<Workout>;
    const addResult = await repo.save(workouts);
    console.log("DB: Workout added", addResult);
    this._workouts = this.loadWorkouts();
    return addResult;
  }
  public async deleteWorkout(workout: Workout) {
    if(!this.Connected) return null;
    const repo = getRepository("workout") as Repository<Workout>;
    const deleteResult = repo.delete({id : workout.id});
    console.log("DB: Workout deleted", deleteResult);
    this._workouts = this.loadWorkouts();
    return  deleteResult;
  }
  public async updateWorkout(workout: Workout) {
    if(!this.Connected) return null;
    const repo = getRepository("workout") as Repository<Workout>;
    const updateResult = await repo.save(workout);
    console.log("DB: Workout updated:", updateResult);
    this._workouts = this.loadWorkouts();
  }
}
