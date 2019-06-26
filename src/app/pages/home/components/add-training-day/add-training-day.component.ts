import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {DataService} from '../../../../services/data.service';
import {DataFactory} from '../../../../resources/factory';
import {Workout} from '../../../../resources/ApiClient';

@Component({
  selector: 'app-add-training-day',
  templateUrl: './add-training-day.component.html',
  styleUrls: ['./add-training-day.component.scss'],
})
export class AddTrainingDayComponent implements OnInit {
  selectedWorkouts: Workout[];
  name: string;

  public get Workouts() {
    return this._dataService.Workouts;
  }
  public get InputsValid() {
    return this.name != null && this.name.length > 0 && this.selectedWorkouts != null && this.selectedWorkouts.length > 0;
  }

  constructor(private _dataService: DataService, private router: Router) { }

  ngOnInit() {

  }

  async onAddDayClick() {
    let newDay = DataFactory.createTrainingDay(this.name, this.selectedWorkouts);
    await this._dataService.addDayToCurrentTrainingPlan(newDay);
    await this.router.navigateByUrl("/home");
  }
}
