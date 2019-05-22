import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../../../../../services/data.service';
import {PopoverController, ToastController} from '@ionic/angular';
import {DataFactory} from '../../../../../resources/factory';
import {TrainingDay, Workout} from '../../../../../resources/ApiClient';

@Component({
  selector: 'app-add-training-manual',
  templateUrl: './add-training-manual.component.html',
  styleUrls: ['./add-training-manual.component.scss'],
})
export class AddTrainingManualComponent implements OnInit {

  public name : string = "";
  public days : TrainingDay[] = [];
  public selectedWorkouts: Workout[];
  public dayName: string;
  
  public get Workouts() {
    return this._dataService.Workouts;
  }
  
  public get InputsValid() {
    return this.dayName != null && this.dayName.length > 0 && this.selectedWorkouts != null && this.selectedWorkouts.length > 0;
  }

  constructor(private _dataService: DataService, private _router: Router, public toastController: ToastController) { }

  ngOnInit() {}

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Training erstellt',
      duration: 2000
    });
    toast.present();
  }

  removeDay(day: TrainingDay) {
    this.days.splice(this.days.indexOf(day), 1);
  }

  onAddDayClick() {
    const newDay = DataFactory.createTrainingDay(this.dayName, this.selectedWorkouts);
    console.log("New Day", newDay);
    this.days.push(newDay);
  }

  async onCreateTraining() {
    if(this.name && this.name.length > 0) {
      const newTrainingPlan = DataFactory.createTrainingPlan(this.name, this.days);
      await this._dataService.createTrainingPlan(newTrainingPlan);
      await this.presentToast();
      await this._router.navigateByUrl("/home/change");
    }
  }
  
  onWorkoutSelect() {
    if(this.dayName != null && this.dayName.length > 0 && this.selectedWorkouts != null && this.selectedWorkouts.length > 0) {
      this.onAddDayClick();
    }
  }
}
