import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {TrainingDayPopoverComponent} from '../training-day/components/training-day-popover/training-day-popover.component';
import {NavController, PopoverController, ToastController} from '@ionic/angular';
import {HistoryItem, Workout} from '../../resources/ApiClient';
import {DataFactory} from '../../resources/factory';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
})
export class WorkoutPage implements OnInit {

  public workout: Workout;
  public repetitions: number = 3;
  public sets = 3;
  public weight = 20;

  constructor(private _dataService: DataService, private route: ActivatedRoute, private _router: Router, public popoverController: PopoverController, public toastController: ToastController, public navCtrl: NavController) {
  }
  
  ngOnInit() {
    try {
      const workoutId = parseInt(this.route.snapshot.paramMap.get('id'));
      this.workout = this._dataService.Workouts.find(w => w.id == workoutId);
      this._dataService.CurrentWorkout = this.workout;
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
    await this._router.navigateByUrl("/workout-history/" + this.workout.id);
  }

  async onTimerClick() {
    await this._router.navigateByUrl("/timer");
  }


  async onFinish() {
    await this.presentToast();
    const historyItem =DataFactory.createWorkoutHistoryItem(this.workout, this.repetitions, this.sets, this.weight);
    await this._dataService.addHistoryItemToDay(this._dataService.CurrentDay, historyItem);
    if(this._dataService.CurrentDay != null) {
      await this._router.navigateByUrl("/training-day/" + this._dataService.CurrentDay.id);
    }
  }

  onDecrementSets() {
    if(this.sets > 0)
      this.sets--;
  }

  onIncrementSets() {
    this.sets++;
  }

  OnDecrementRepetitions() {
    if(this.repetitions > 0)
      this.repetitions--;
  }

  OnIncrementRepetitions() {
    this.repetitions++;
  }

  onDecrementWeight() {
    if(this.weight > 0)
      this.weight--;
  }

  onIncrementWeight() {
    this.weight++;
  }
}
