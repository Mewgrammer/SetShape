import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {EWorkoutType, IWorkout, Workout} from '../../resources/models/workout';
import {TrainingDayPopoverComponent} from '../training-day/components/training-day-popover/training-day-popover.component';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
})
export class WorkoutPage implements OnInit {

  public workout: IWorkout;
  private workoutType: EWorkoutType;

  constructor(private _dataService: DataService, private route: ActivatedRoute, private _router: Router, public popoverController: PopoverController,) {

  }


  ngOnInit() {
    try {
      this.workoutType = <EWorkoutType>parseInt(this.route.snapshot.paramMap.get('type'));
      console.log("Workout - Type:", this.workoutType);
      if(this.workoutType != null) {
        const match = this._dataService.Workouts.find(w => w.type == <number>this.workoutType);
        this.workout = Workout.create(match);
        console.log("Workout - ", this.workout);
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: TrainingDayPopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  async onHistoryClick() {
    await this._router.navigateByUrl("/workout-history/" + this.workout.type);
  }

  async onTimerClick() {
    await this._router.navigateByUrl("/timer");
  }


  onFinish() {
    this._dataService.addHistoryItem(this.workout);
  }

  onDecrementSets() {
    if(this.workout.sets > 0)
      this.workout.sets--;
  }

  onIncrementSets() {
    this.workout.sets++;
  }

  OnDecrementRepetitions() {
    if(this.workout.repetitions > 0)
      this.workout.repetitions--;
  }

  OnIncrementRepetitions() {
    this.workout.repetitions++;
  }

  onDecrementWeight() {
    if(this.workout.weight > 0)
      this.workout.weight--;
  }

  onIncrementWeight() {
    this.workout.weight++;
  }
}
