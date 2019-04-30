import {Component, OnInit} from '@angular/core';
import {NavController, PopoverController} from '@ionic/angular';
import {TrainingsPopoverComponent} from './components/trainings-popover/trainings-popover.component';
import {ITrainingDay, ITrainingPlan} from '../../resources/models/training-plan';
import {TestData} from '../../resources/testdata';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  public trainingPlan: ITrainingPlan;
  public trainingDays: ITrainingDay[] = [];

  constructor(private _dataService: DataService, private _router: Router,  public popoverController: PopoverController) {}

  ngOnInit() {
    this.trainingPlan = this._dataService.CurrentTrainingPlan;
    if(this.trainingPlan != null)
      this.trainingDays = this.trainingPlan.days;
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

  async onDayClick(day: ITrainingDay) {
    await this._router.navigateByUrl(this._router.url + "/training-day/" + day.id);
  }
}
