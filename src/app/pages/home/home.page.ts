import {Component, OnInit} from '@angular/core';
import {NavController, PopoverController} from '@ionic/angular';
import {TrainingsPopoverComponent} from './components/trainings-popover/trainings-popover.component';
import {ITrainingDay, ITrainingPlan} from '../../resources/models/interfaces';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';
import {TrainingDay} from '../../resources/models/entities';
import {DatabaseService} from '../../services/database.service';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  
  public appReady = false;

  public get TrainingPlan() {
    return this._dataService.CurrentTrainingPlan;
  }
  public get TrainingDays() {
    return this.TrainingPlan.days;
  }

  constructor(private _dataService: DataService, private _dbService: DatabaseService, private _router: Router,  public popoverController: PopoverController) {}

  async ngOnInit() {

    this._dbService.dbReady.subscribe( async (ready) => {
      this.appReady = ready;
      if(this.TrainingPlan == null) {
        await this._router.navigateByUrl(this._router.url + "/change");
      }
    });
    this.appReady = this._dbService.dbReady.value;
    if(this.appReady == true && this.TrainingPlan == null) {
      await this._router.navigateByUrl(this._router.url + "/change");
    }
  }

  public async navigateToAddPage() {
    await this.popoverController.dismiss();
    await this._router.navigateByUrl(this._router.url + "/create");
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: TrainingsPopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  async onDayClick(day: TrainingDay) {
    await this._router.navigateByUrl(this._router.url + "/training-day/" + day.id);
  }

  async removeDay(day: TrainingDay) {
    await this._dataService.removeTrainingDay(day);
  }

  async onChangeTraining() {
    if(this._dataService.TrainingPlans.length > 0) {
      await this._router.navigateByUrl(this._router.url + "/change");
    }
    else {
      await this._router.navigateByUrl(this._router.url + "/create");
    }
  }
}
