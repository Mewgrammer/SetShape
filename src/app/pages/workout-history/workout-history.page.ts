import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import {HistoryItem, Workout} from '../../resources/ApiClient';

@Component({
  selector: 'app-workout-history',
  templateUrl: './workout-history.page.html',
  styleUrls: ['./workout-history.page.scss'],
})
export class WorkoutHistoryPage implements OnInit {

  public workout: Workout;

  public get History() {
    if(this._dataService.CurrentDay == null) return [];
    return this._dataService.CurrentDay.history;
  }

  constructor(public _dataService: DataService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    try{
      const workoutId = parseInt(this.route.snapshot.paramMap.get('id'));
      this.workout = this._dataService.Workouts.find(w => w.id == workoutId);
    }
    catch (e) {
      console.error(e);
    }
  }
  
  presentPopover($event: MouseEvent) {
    
  }

  async removeItem(item: HistoryItem) {
    await this._dataService.removeHistoryItemFromDay(this._dataService.CurrentDay, item);
  }
}
