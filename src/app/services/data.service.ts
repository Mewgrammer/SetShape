import { Injectable } from '@angular/core';
import {HistoryItem, TrainingDay, TrainingPlan, User,  Workout} from '../resources/ApiClient';
import {ApiService} from './api.service';
import {Platform, ToastController} from '@ionic/angular';
import {BehaviorSubject, Subject} from 'rxjs';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  public onLogin: BehaviorSubject<boolean>;
  public onDataChanged: Subject<User>;
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
    this.onDataChanged = new Subject<User>();
    this.autoLogin();
  }
  
  private async updateUserData() {
    if (this._user != null) {
      this._user = await this._apiService.getUserById(this._user.id);
      console.log("UserData updated", this._user);
      if (this.CurrentDay != null) {
        const days = this._user.currentTrainingPlan.days;
        this._currentDay = days.find(d => d.id == this.CurrentDay.id);
        if (this.CurrentWorkout != null) {
          const workouts = this._currentDay.workouts;
          this._currentWorkout = workouts.find( w => w.id == this.CurrentWorkout.id);
        }
      }
      this.onDataChanged.next(this.User);
    }
    else {
      console.log("failed to update UserData");
    }
  }
  
  public workoutOfDayIsFinished(workout: Workout, day: TrainingDay,) {
    const workoutsInLastWeek = day.history.filter(w => w.workout.id == workout.id && w.date.getTime() > moment(new Date()).subtract(1, 'week').toDate().getTime());
    return workoutsInLastWeek != null && workoutsInLastWeek.length > 0;
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
      this.onDataChanged.next(this.User);
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
      await this._apiService.addDayToTraining(this._user.currentTrainingPlan, newDay);
      await this.updateUserData();
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
      await this.updateUserData();
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
      await this.updateUserData();
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
      await this.updateUserData();
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
      await this.updateUserData();
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
      await this.updateUserData();
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
      await this.updateUserData();
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
      await this.updateUserData();
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
      await this.updateUserData();
    }
    catch (e) {
      await this._toaster.create({
        message: "Fehler: " + e.message,
        color: 'danger'
      });
    }
  }
}
