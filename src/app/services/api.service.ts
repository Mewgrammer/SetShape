import { Injectable } from '@angular/core';
import {
  DayHistoryItemForm,
  HistoryItem,
  HistoryItemsClient,
  SetShapeClient, TrainingDay,
  TrainingDaysClient, TrainingDayWorkout, TrainingPlan, TrainingPlanDayForm,
  TrainingPlansClient, User, UserForm,
  UsersClient, UserTrainingForm, Workout,
  WorkoutsClient
} from '../resources/ApiClient';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private readonly _apiUrl;
  private _setShapeClient: SetShapeClient;
  private _historyClient: HistoryItemsClient;
  private _usersClient: UsersClient;
  private _trainingDaysClient: TrainingDaysClient;
  private _trainingPlansClient: TrainingPlansClient;
  private _workoutsClient: WorkoutsClient;
  
  public get Workouts() {
    return this._workoutsClient.getWorkouts();
  }
  
  public get HistoryApi() {
    return this._historyClient;
  }
  
  public get TrainingDayApi() {
    return this._trainingDaysClient;
  }
  
  public get WorkoutApi() {
    return this._workoutsClient;
  }
  
  public get TrainingPlanApi() {
    return this._trainingPlansClient;
  }

  constructor() {
    this._apiUrl = "https://localhost:44300";
    this.init();
  }
  
  public init() {
    this._setShapeClient = new SetShapeClient(this._apiUrl);
    this._workoutsClient = new WorkoutsClient(this._apiUrl);
    this._trainingPlansClient = new TrainingPlansClient(this._apiUrl);
    this._historyClient = new HistoryItemsClient(this._apiUrl);
    this._trainingDaysClient = new TrainingDaysClient(this._apiUrl);
    this._usersClient = new UsersClient(this._apiUrl);
  }
  
  public getUserById(id: number) {
    return this._setShapeClient.getFullUser(id);
  }
  
  public async login(name: string, password: string):  Promise<User | null>{
    const data = new UserForm({name: name, password: password});
    return  await this._usersClient.login(data);
  }
  
  public async register(name: string, password: string) {
    const data = new UserForm({name: name, password: password});
    return  await this._usersClient.register(data);
  }
  
  public async addTrainingPlanToUser(userId: number, trainingPlan: TrainingPlan) {
    const data = new UserTrainingForm({userId: userId, trainingPlan: trainingPlan});
    console.log("Adding Trainingplan to user", data);
    return await this._setShapeClient.addTrainingToUser(data);
  }
  
  public async removeTrainingPlanFromUser(userId: number, trainingPlan: TrainingPlan) {
    const data = new UserTrainingForm({userId: userId, trainingPlan: trainingPlan});
    return await this._setShapeClient.removeTrainingFromUser(data);
  }
  
  public async setActiveTrainingPlanOfUser(userId: number, trainingPlan: TrainingPlan) {
    const data = new UserTrainingForm({userId: userId, trainingPlan: trainingPlan});
    return await this._setShapeClient.setActiveTrainingPlan(data);
  }
  
  public async addWorkoutToDay(day: TrainingDay, workout: Workout) {
    const data = new TrainingDayWorkout({id: 0, trainingDay: day, trainingDayId: day.id, workout: workout, workoutId: workout.id});
    return await this._setShapeClient.addWorkoutToDay(data);
  }
  
  public async removeWorkoutFromDay(day: TrainingDay, workout: Workout) {
    const data = new TrainingDayWorkout({id: 0, trainingDay: day, trainingDayId: day.id, workout: workout, workoutId: workout.id});
    return await this._setShapeClient.removeWorkoutFromDay(data);
  }
  
  public async addHistoryItemToDay(dayId: number, item: HistoryItem) {
    const data = new DayHistoryItemForm({dayId: dayId, item: item});
    return await this._setShapeClient.addHistoryItemToDay(data);
  }
  
  public async removeHistoryItemFromDay(dayId: number, item: HistoryItem) {
    const data = new DayHistoryItemForm({dayId: dayId, item: item});
    return await this._setShapeClient.removeHistoryItemFromDay(data);
  }
  
  public async addDayToTraining(trainingId: number, day: TrainingDay) {
    const data = new TrainingPlanDayForm({trainingPlanId: trainingId, day: day});
    return await this._setShapeClient.addTrainingDayToTrainingPlan(data);
  }
  
  public async removeDayFromTraining(trainingId: number, day: TrainingDay) {
    const data = new TrainingPlanDayForm({trainingPlanId: trainingId, day: day});
    return await this._setShapeClient.removeTrainingDayFromTrainingPlan(data);
  }
}
