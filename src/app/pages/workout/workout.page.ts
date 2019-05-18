import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {TrainingDayPopoverComponent} from '../training-day/components/training-day-popover/training-day-popover.component';
import {NavController, PopoverController, ToastController} from '@ionic/angular';
import {EWorkoutType, IWorkout} from '../../resources/models/interfaces';
import {Workout} from '../../resources/models/entities';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
})
export class WorkoutPage implements OnInit {

  public workout: Workout;
  private workoutType: EWorkoutType;

  constructor(private _dataService: DataService, private route: ActivatedRoute, private _router: Router, public popoverController: PopoverController, public toastController: ToastController, public navCtrl: NavController) {

  }


  ngOnInit() {
    try {
      this.workoutType = <EWorkoutType>parseInt(this.route.snapshot.paramMap.get('type'));
      if(this.workoutType != null) {
        this.workout = this._dataService.Workouts.find(w => w.type == <number>this.workoutType);
        this._dataService.CurrentWorkout = this.workout;
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Übung abgeschlossen',
      duration: 2000
    });
    toast.present();
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


  async onFinish() {
    await this.presentToast();
    await this._dataService.addHistoryItem(this.workout);
    if(this._dataService.CurrentDay != null) {
      await this._router.navigateByUrl("/training-day/" + this._dataService.CurrentDay.id);
    }
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
