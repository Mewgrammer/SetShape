import { Injectable } from '@angular/core';
import {HistoryItem, TrainingDay, TrainingPlan, User,  Workout} from '../resources/ApiClient';
import {ApiService} from './api.service';
import {Platform, ToastController} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public onLogin: BehaviorSubject<boolean>;
  private _user: User;
  private _workouts: Workout[] = [];
  private _currentWorkout: Workout = null; // helper for Nav
  private _currentDay: TrainingDay = null; // helper for Nav

  public get User() {
    return this._user;
  }
  public get LoggedIn() {
    return this._user != null && this.onLogin.value;
  }
  public  get CurrentWorkout() {
    return this._currentWorkout;
  }
  public set CurrentWorkout(workout: Workout) {
    this._currentWorkout = workout;
  }
  public get CurrentDay() {
    return this._currentDay;
  }
  public set CurrentDay(day: TrainingDay) {
    this._currentDay = day;
  }
  public get TrainingPlans() {
    return [...this.User.trainings];
  }

  public get CurrentTrainingPlan() {
    return this.User.currentTrainingPlan;
  }

  public get Workouts(): Workout[] {
    return [...this._workouts];
  }
  

  constructor(private _plt: Platform, private _apiService: ApiService, private _toaster: ToastController) {
    this.onLogin = new BehaviorSubject<boolean>(false);
    this.autoLogin();
  }
  
  public autoLogin() {
    try {
      this._plt.ready().then( async () => {
        const loginData: {username: string, password: string} = this.readPersistetLoginData();
        await this.login(loginData.username, loginData.password);
        console.log("Auto Login success !", this.User);
      });
    }
    catch (e) {
      console.log("Auto Login failed !");
    }
  }
  
  public async login(username: string, password: string) {
    try {
      console.log("Logging in", username);
      this._user = await this._apiService.login(username, password);
      this._workouts = await this._apiService.Workouts;
      this.onLogin.next(true);
    }
    catch (e) {
      await this._toaster.create({
        message: "Login fehlgeschlagen - " + e.message,
        color: 'danger'
      })
    }
    if(this.LoggedIn) {
      this.persistLoginData(username,password);
      await this._toaster.create({
        message: "erfolgreich eingeloggt als '" + username + "'",
        color: 'success'
      });
    }
  }
  
  private readPersistetLoginData() {
    if(!this._plt.is("cordova")) {
      return JSON.parse(localStorage.getItem("setshape_login"));
    }
  }
  
  private persistLoginData(username: string, password: string) {
    if(!this._plt.is("cordova")) {
      localStorage.setItem("setshape_login",JSON.stringify({username: username, password: password}));
    }
  }
  
  public async register(username: string, password: string) {
    try {
      console.log("registering", username);
      await this._apiService.register(username, password);
      await this._toaster.create({
        message: "erfolgreich registriert",
        color: 'success'
      });
      await this.login(username, password);
    }
    catch (e) {
      await this._toaster.create({
        message: "registration fehlgeschlagen - " + e.message,
        color: 'danger'
      });
    }
  }
  
  public async addDayToCurrentTrainingPlan(day: TrainingDay) {
    try {
      day.id = 0;
      const newDay = await this._apiService.TrainingDayApi.postTrainingDay(day);
      await this._apiService.addDayToTraining(newDay.id, this._user.currentTrainingPlan);
      this._user.currentTrainingPlan.days.push(day);
    }
    catch (e) {
      await this._toaster.create({
        message: "Fehler: " + e.message,
        color: 'danger'
      });
    }
  }

  public async createTrainingPlan(plan: TrainingPlan) {
    try{
      await this._apiService.addTrainingPlanToUser(this.User.id, plan);
      this._user.trainings.push(plan);
    }
    catch (e) {
      await this._toaster.create({
        message: "Fehler: " + e.message,
        color: 'danger'
      });
    }
  }

  public async changeTrainingPlan(plan: TrainingPlan) {
    try {
      console.log("change TrainingPlan", plan);
      await this._apiService.setActiveTrainingPlanOfUser(this.User.id, plan);
      this._user.currentTrainingPlan = plan;
    }
    catch (e) {
      await this._toaster.create({
        message: "Fehler: " + e.message,
        color: 'danger'
      });
    }
  }

  public async removeTrainingPlan(plan: TrainingPlan) {
    try {
      await this._apiService.removeTrainingPlanFromUser(this.User.id, plan);
      this._user.trainings.splice(this._user.trainings.indexOf(plan), 1);
    }
    catch (e) {
      await this._toaster.create({
        message: "Fehler: " + e.message,
        color: 'danger'
      });
    }
  }

  public async removeTrainingDay(day: TrainingDay) {
    try {
      await this._apiService.removeDayFromTraining(this._user.currentTrainingPlan.id, day);
      this._user.currentTrainingPlan.days.splice(this._user.currentTrainingPlan.days.indexOf(day), 1);
    }
    catch (e) {
      await this._toaster.create({
        message: "Fehler: " + e.message,
        color: 'danger'
      });
    }
  }
  
  public async addWorkoutToDay(workout: Workout, day: TrainingDay) {
    try {
      await this._apiService.addWorkoutToDay(day.id, workout);
    }
    catch (e) {
      await this._toaster.create({
        message: "Fehler: " + e.message,
        color: 'danger'
      });
    }
  }
  
  public async removeWorkoutFromDay(workout: Workout, day: TrainingDay) {
    try {
      await this._apiService.removeWorkoutFromDay(day.id, workout);
    }
    catch (e) {
      await this._toaster.create({
        message: "Fehler: " + e.message,
        color: 'danger'
      });
    }
  }

  public async removeHistoryItemFromDay(day: TrainingDay, item: HistoryItem) {
    try {
      await this._apiService.removeHistoryItemFromDay(day.id, item);
      day.history.splice(day.history.indexOf(item), 1);
    }
    catch (e) {
      await this._toaster.create({
        message: "Fehler: " + e.message,
        color: 'danger'
      });
    }
  }
  
  public async addHistoryItemToDay(day: TrainingDay, item: HistoryItem) {
    try {
      await this._apiService.addHistoryItemToDay(day.id, item);
      day.history.push(item);
    }
    catch (e) {
      await this._toaster.create({
        message: "Fehler: " + e.message,
        color: 'danger'
      });
    }
  }
}
