import { Injectable } from '@angular/core';
import {HistoryItem, TrainingDay, TrainingPlan, User,  Workout} from '../resources/ApiClient';
import {ApiService} from './api.service';
import {Platform, ToastController} from '@ionic/angular';
import {BehaviorSubject, Subject} from 'rxjs';
import * as moment from 'moment';
import { File } from '@ionic-native/file/ngx';
import {json, path} from '@angular-devkit/core';


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
  private _loginFileName = "loginData.json";

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
    if(this.User == null) return [];
    return [...this.User.trainings];
  }
  public get CurrentTrainingPlan() {
    if(this.User == null) return null;
    return this.User.currentTrainingPlan;
  }

  public get Workouts(): Workout[] {
    return [...this._workouts];
  }
  public get WorkoutsOfUser(): Workout[] {
    if(!this.LoggedIn || this.User == null) {
      return [];
    }
    return this.Workouts.filter(
      w => this.User.trainings.find(
        t => t.days.find(
          td => td.workouts.find(
            tdw => tdw.id == w.id)
            != null)
          != null )
        != null );
  }
  
  private get LoginFileDirectory() {
    return this.file.dataDirectory + "/setshape";
  }
  

  constructor(private _plt: Platform, private _apiService: ApiService, private _toaster: ToastController, private file: File) {
    this.onLogin = new BehaviorSubject<boolean>(false);
    this.onDataChanged = new Subject<User>();
    this.autoLogin();
  }
  
  public countDaysWithCompletedWorkout() {
    if(!this.LoggedIn) return 0;
    let uniqueDays: Date[] = [];
    this.User.trainings.forEach(training => {
      training.days.forEach(day => {
        day.history.forEach(historyItem => {
          if(uniqueDays.find(d => d.getUTCFullYear() == historyItem.date.getUTCFullYear()
            && d.getUTCMonth() == historyItem.date.getUTCMonth()
            && d.getUTCDate() == historyItem.date.getUTCDate()) == null
          ) {
            uniqueDays.push(historyItem.date);
          }
        });
      });
    });
    return uniqueDays.length;
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
        if(loginData == null) return;
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
      console.warn("Login Failed", e);
      this.onLogin.next(false);
      (await this._toaster.create({
        duration: 2000,
        message: "Login fehlgeschlagen - " + e.message,
        color: 'danger'
      })).present();
      
    }
    if(this.LoggedIn) {
     await this.persistLoginData(username, password);
      (await this._toaster.create({
        duration: 2000,
        message: "erfolgreich eingeloggt als '" + username + "'",
        color: 'success'
      })).present();
    }
  }
  
  public async Logout() {
    try {
      if(!this._plt.is("cordova")) {
        localStorage.removeItem("setshape_login");
      }
      else {
        await this.file.checkDir(this.file.dataDirectory, 'setshape');
        await this.file.removeFile(this.LoginFileDirectory, this._loginFileName);
      }
    }
    catch (e) {
      console.warn("Error on Logout:", e);
    }
    this._user = null;
    this.onLogin.next(false);
  }
  
  private readPersistetLoginData() {
    let loginData = null;
    if(!this._plt.is("cordova")) {
      loginData = JSON.parse(localStorage.getItem("setshape_login"));
    }
    else {
      this.file.checkDir(this.file.dataDirectory, 'setshape')
        .then(_ => console.log("setshape Directory exists"))
        .catch(async (err) => {
          console.log("Directory doesnt exist");
          await this.file.createDir(this.file.dataDirectory, "setshape", true);
        });
      this.file.checkFile( this.LoginFileDirectory, this._loginFileName)
        .then(async() => {
          const jsonContent = await this.file.readAsText(this.LoginFileDirectory, this._loginFileName);
          loginData = JSON.parse(jsonContent);
        })
        .catch(async (err) => {
          console.log("loginData.json doesnt exist", err);
        });
    }
    return loginData;
  }
  
  private async persistLoginData(username: string, password: string) {
    let jsonContent = JSON.stringify({username: username, password: password})
    if(!this._plt.is("cordova")) {
      localStorage.setItem("setshape_login", jsonContent);
    }
    else {
      try {
        await this.file.checkDir(this.file.dataDirectory, 'setshape');
      }
      catch (e) {
        await this.file.createDir(this.file.dataDirectory, "setshape", true);
      }
      await this.file.writeFile(this.LoginFileDirectory, this._loginFileName, jsonContent, { replace: true});
    }
  }
  
  public async register(username: string, password: string) {
    try {
      console.log("registering", username);
      await this._apiService.register(username, password);
      (await this._toaster.create({
        duration: 2000,
        message: "erfolgreich registriert",
        color: 'success'
      })).present();
      await this.login(username, password);
    }
    catch (e) {
      (await this._toaster.create({
        duration: 2000,
        message: "registration fehlgeschlagen - " + e.message,
        color: 'danger'
      })).present();
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
