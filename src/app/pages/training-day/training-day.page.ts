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

  public day: TrainingDay;
  private dayId: number;

  constructor(private _dataService: DataService, private _router: Router,  public popoverController: PopoverController, private route: ActivatedRoute) {

  }

  ngOnInit() {
    try {
      this.dayId = parseInt(this.route.snapshot.paramMap.get('id'));
      if(this.dayId != null) {
        this.day = this._dataService.CurrentTrainingPlan.days.find(d => d.id == this.dayId);
        this._dataService.CurrentDay = this.day;
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  public WorkoutIsFinished(workout: Workout) {
    const workoutsInLastWeek = this.day.history.filter(w => w.workout.id == workout.id && w.date.getTime() > moment(new Date()).subtract(1, 'week').toDate().getTime());
    return workoutsInLastWeek != null && workoutsInLastWeek.length > 0;
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
  }
}
