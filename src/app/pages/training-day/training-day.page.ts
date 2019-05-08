import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ITrainingDay, IWorkout} from '../../resources/models/interfaces';
import {PopoverController} from '@ionic/angular';
import {TrainingDayPopoverComponent} from './components/training-day-popover/training-day-popover.component';
import * as moment from 'moment';

@Component({
  selector: 'app-training-day',
  templateUrl: './training-day.page.html',
  styleUrls: ['./training-day.page.scss'],
})
export class TrainingDayPage implements OnInit {

  public day: ITrainingDay;
  private dayId: number;

  constructor(private _dataService: DataService, private _router: Router,  public popoverController: PopoverController, private route: ActivatedRoute) {

  }

  ngOnInit() {
    try {
      this.dayId = parseInt(this.route.snapshot.paramMap.get('id'));
      console.log("Training Day - Id:", this.dayId);
      if(this.dayId != null) {
        this.day = this._dataService.CurrentTrainingPlan.days.find(d => d.id == this.dayId);
        console.log("Training Day - ", this.day);
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  public WorkoutIsFinished(workout: IWorkout) {
    const workoutsInLastWeek = this._dataService.WorkoutHistory.filter(w => w.workout.type == workout.type && w.date.getTime() > moment(new Date()).subtract('week', 1).toDate().getTime());
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

  async onWorkoutClick(workout: IWorkout) {
   await this._router.navigateByUrl("/workout/" + workout.type);
  }

  removeWorkout(workout: IWorkout) {
    this._dataService.removeWorkoutFromDay(workout, this.day);
    this.day = this._dataService.CurrentTrainingPlan.days.find(d => d.id == this.dayId);
  }
}
