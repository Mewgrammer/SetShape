import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../../../services/data.service';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {TrainingDay, TrainingDayWorkout, Workout} from '../../../../../resources/ApiClient';
import {DataFactory} from '../../../../../resources/factory';

@Component({
  selector: 'app-generate-training',
  templateUrl: './generate-training.component.html',
  styleUrls: ['./generate-training.component.scss'],
})
export class GenerateTrainingComponent implements OnInit {

  public name : string = "";
  public countDays : number = 1;
  public days : TrainingDay[] = [];
  public selectedWorkouts: Workout[];
  public generatedWorkouts: Workout[];
  public dayName: string;
  public selectedGoal: string;
  public selectedExperience: string;
  isExperienced: boolean;
  
  public get Workouts() {
    return this._dataService.Workouts;
  }
  public get InputsValid() {
    return this.dayName != null && this.dayName.length > 0 && this.selectedWorkouts != null && this.selectedWorkouts.length > 0;
  }

  constructor(private _dataService: DataService, private _router: Router, public toastController: ToastController) { }

  ngOnInit() {}

  async onCreateTraining() {
    console.log("IsExperienced" + this.isExperienced);
    if(this.countDays < 1 || this.countDays > 7) {
      await this.presentWarningToast();
    }
    else if(this.selectedGoal!=null){
      this.generateTraining();
      //await this._router.navigateByUrl("/change");
    }
  }

  async presentWarningToast() {
    const toast = await this.toastController.create({
      message: 'Die Anzahl der Tage muss zwischen 1 und 7 liegen',
      duration: 2000
    });
    toast.present();
  }

  generateTraining() {
    if (!this.isExperienced) {
      if(this.countDays < 4){
        console.log("Anfänger GK");
      }
      else if(this.countDays < 6){
        console.log("Anfänger OK/UK")
      }
      else {
        console.log("Anfänger PUSH/PULL/LEGS")
      }
    }
    else {
      if (this.countDays < 4) {
        console.log("Profi GK");
      }
      else if (this.countDays < 6) {
        console.log("Profi OK/UK")
      }
      else {
        console.log("Profi PUSH/PULL/LEGS")
      }
    }
  }
}
