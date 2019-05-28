import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';
import {TrainingDayPopoverComponent} from './components/training-day-popover/training-day-popover.component';
import * as moment from 'moment';
import {TrainingDay, Workout} from '../../resources/ApiClient';

@Component({
  selector: 'app-training-day',
  templateUrl: './training-day.page.html',
  styleUrls: ['./training-day.page.scss'],
})
export class TrainingDayPage implements OnInit {

  public get Day() {
    return this.day;
  }
  
  public day: TrainingDay;
  private dayId: number;

  constructor(private _dataService: DataService, private _router: Router,  public popoverController: PopoverController, private route: ActivatedRoute) {

  }

  ngOnInit() {
    try {
      this._dataService.onDataChanged.subscribe( (data) => {
        this.day = this._dataService.CurrentTrainingPlan.days.find(d => d.id == this.dayId);
        this._dataService.CurrentDay = this.day;
        console.log("UserDataUpated, Training-day:", this.day)
      });
      this.dayId = parseInt(this.route.snapshot.paramMap.get('id'));
      if(this.dayId != null) {
        this.day = this._dataService.CurrentTrainingPlan.days.find(d => d.id == this.dayId);
        this._dataService.CurrentDay = this.day;
      }
      console.log("Init Training-Day", this.day);
    }
    catch (e) {
      console.error(e);
    }
  }

  public WorkoutIsFinished(workout: Workout) {
    return this._dataService.workoutOfDayIsFinished(workout, this.day);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: TrainingDayPopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  async onWorkoutClick(workout: Workout) {
   await this._router.navigateByUrl("/workout/" + workout.id);
  }

  async removeWorkout(workout: Workout) {
    await this._dataService.removeWorkoutFromDay(workout, this.day);
    this.day = this._dataService.CurrentTrainingPlan.days.find(d => d.id == this.dayId);
    await this._router.navigateByUrl("/trainingDay/" + this.dayId); //make sure we stay on this page
  }
  
  getWorkoutCardColor(workout: Workout) {
    return this.WorkoutIsFinished(workout) ? "success" : "warning";
  }
}
