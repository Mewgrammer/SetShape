import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import {Workout} from '../../../../resources/ApiClient';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-workout',
  templateUrl: './add-workout.component.html',
  styleUrls: ['./add-workout.component.scss'],
})
export class AddWorkoutComponent implements OnInit {

  constructor(public _dataService: DataService, private _router: Router) {
	}

	async onSelectWorkout(workout: Workout) {
		await this._dataService.addWorkoutToDay(workout, this._dataService.CurrentDay);
		await this._router.navigateByUrl("/training-day/" + this._dataService.CurrentDay.id); //make sure we stay on this page
	}
	
	ngOnInit() {
 
	}
}
