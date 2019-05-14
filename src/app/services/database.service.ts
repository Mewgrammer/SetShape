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

  public get ActivePlan() {
    if(this._activeTrainingPlan == null)
      this._activeTrainingPlan = this.findActiveTrainingPlan();
    return this._activeTrainingPlan;
  }

  private _connection: Connection;

  private _trainingDays: Promise<TrainingDay[]>;
  private _history: Promise<WorkoutHistoryItem[]>;
  private _workouts:  Promise<Workout[]>;
  private _activeTrainingPlan:  Promise<TrainingPlan>;
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
      let workouts = await this._connection.manager.find(Workout);
      if(workouts.length == 0) {
        await this.addWorkouts(TestData.workouts);
        console.log("Added default Workouts");
      }
      workouts = await this.loadWorkouts();
      const history = await this.loadHistory();
      const days = await this.loadTrainingDays();
      const plans = await this.loadTrainingPlans();

      console.log("Workouts", workouts);
      console.log("Days", days);
      console.log("Plans", plans);
      console.log("History", history);
    }
    catch (e) {
      console.error(e);
    }
  }

  // *****************************************************************************
  // History Item
  // *****************************************************************************
  private async loadHistory(): Promise<WorkoutHistoryItem[]> {
    this._history = this._connection.manager.find(WorkoutHistoryItem, { relations: ["workout"]});
    return this._history;
  }
  public async addHistoryItem(item: WorkoutHistoryItem): Promise<WorkoutHistoryItem> {
    item.id = undefined; // Make sure Id is not set - it will be auto-generated
    const addResult = await this._connection.manager.save(item);
    console.log("WorkoutHistoryItem added", addResult);
    return addResult;
  }
  public async addHistoryItems(items: WorkoutHistoryItem[]) {
    items = items.map(w => {
      w.id = undefined;
      return w;
    });
    const addResult = await this._connection.manager.save(items);
    console.log("WorkoutHistoryItem added", addResult);
    return addResult;
  }
  public async updateHistoryItem(updatedDay: TrainingDay) {
    const repo = getRepository("trainingDay") as Repository<TrainingDay>;
    const updateResult = await repo.createQueryBuilder().update(TrainingDay)
        .set(updatedDay)
        .where("id = :id", { id: updatedDay.id })
        .execute();
    console.log("TrainingDay updated:", updateResult);
  }
  public async deleteHistoryItem(item: WorkoutHistoryItem) {
    const deleteResult = this._connection.manager.delete(WorkoutHistoryItem, {id : item.id});
    console.log("WorkoutHistoryItem deleted", deleteResult);
    return  deleteResult;
  }

  // *****************************************************************************
  // Training Plan
  // *****************************************************************************
  private async loadTrainingPlans(): Promise<TrainingPlan[]> {
    this._trainingPlans = this._connection.manager.find(TrainingPlan, { relations: ["days"]});
    return this._trainingPlans;
  }
  private async findActiveTrainingPlan(): Promise<TrainingPlan> {
    return await this._connection.manager.findOne(TrainingPlan, { relations: ["days"], where: "active = true"});
  }
  public async addTrainingPlan(plan: TrainingPlan): Promise<TrainingPlan> {
    plan.id = undefined; // Make sure Id is not set - it will be auto-generated
    const addedEntity = await this._connection.manager.save(plan);
    console.log("TrainingPlan added", addedEntity);
    return addedEntity;
  }
  public async addTrainingPlans(plans: TrainingPlan[]) {
    plans = plans.map(w => {
      w.id = undefined;
      return w;
    });
    const addResult = await this._connection.manager.save(plans);
    console.log("TrainingPlan added", addResult);
    return addResult;
  }
  public async updateTrainingPlan(updatedPlan: TrainingPlan) {
    const repo = getRepository("trainingPlan") as Repository<TrainingPlan>;
    const updateResult = await repo.createQueryBuilder().update(TrainingPlan)
        .set(updatedPlan)
        .where("id = :id", { id: updatedPlan.id })
        .execute();
    console.log("TrainingPlan updated:", updateResult);
  }
  public async deleteTrainingPlan(plan: TrainingPlan) {
    const deleteResult = this._connection.manager.delete(TrainingPlan, {id : plan.id});
    console.log("TrainingPlan deleted", deleteResult);
    return  deleteResult;

  }
  
  // *****************************************************************************
  // Training Day
  // *****************************************************************************
  private async loadTrainingDays(): Promise<TrainingDay[]> {
    this._trainingDays = this._connection.manager.find(TrainingDay, { relations: ["workouts"]});
    return this._trainingDays;
  }
  public async addTrainingDay(day: TrainingDay) {
    day.id = undefined; // Make sure Id is not set - it will be auto-generated
    const addResult = await this._connection.manager.save(day);
    console.log("Workout added", addResult);
    return addResult;
  }
  public async addTrainingDays(days: TrainingDay[]) {
    days = days.map(w => {
      w.id = undefined;
      return w;
    });
    const addResult = await this._connection.manager.save(days);
    console.log("Workout added", addResult);
    return addResult;
  }
  public async updateTrainingDay(updatedDay: TrainingDay) {
    const repo = getRepository("trainingDay") as Repository<TrainingDay>;
    const updateResult = await repo.createQueryBuilder().update(TrainingDay)
        .set(updatedDay)
        .where("id = :id", { id: updatedDay.id })
        .execute();
    console.log("TrainingDay updated:", updateResult);
  }
  public async deleteTrainingDay(day: TrainingDay) {
    const deleteResult = this._connection.manager.delete(TrainingDay, {id : day.id});
    console.log("TrainingDay deleted", deleteResult);
    return  deleteResult;
  }

  // *****************************************************************************
  // Workout
  // *****************************************************************************
  private async loadWorkouts(): Promise<Workout[]> {
    this._workouts = this._connection.manager.find(Workout);
    return this._workouts;
  }
  public async addWorkout(workout: Workout) {
    workout.id = undefined; // Make sure Id is not set - it will be auto-generated
    const addResult = await this._connection.manager.save(workout);
    console.log("Workout added", addResult);
    return addResult;
  }
  public async addWorkouts(workouts: Workout[]) {
    workouts = workouts.map(w => {
      w.id = undefined;
      return w;
    });
    const addResult = await this._connection.manager.save(workouts);
    console.log("Workout added", addResult);
    return addResult;
  }
  public async deleteWorkout(workout: Workout) {
    const deleteResult = this._connection.manager.delete(Workout, {id : workout.id});
    console.log("Workout deleted", deleteResult);
    return  deleteResult;
  }
  public async updateWorkout(workout: Workout) {
    const repo = getRepository("workout") as Repository<Workout>;
    const updateResult = await repo.createQueryBuilder().update(Workout)
        .set(workout)
        .where("id = :id", { id: workout.id })
        .execute();
    console.log("Workout updated:", updateResult);
  }
}
