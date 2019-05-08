import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import {EWorkoutType, IWorkoutHistoryItem} from '../../resources/models/interfaces';

@Component({
  selector: 'app-workout-history',
  templateUrl: './workout-history.page.html',
  styleUrls: ['./workout-history.page.scss'],
})
export class WorkoutHistoryPage implements OnInit {

  private workoutType: EWorkoutType;

  public get History() {
    return this._dataService.WorkoutHistory.filter(w => w.workout.type == this.workoutType)
  }

  constructor(private _dataService: DataService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    try{
      this.workoutType = <EWorkoutType>parseInt(this.route.snapshot.paramMap.get('type'));
    }
    catch (e) {
      console.error(e);
    }
  }


  presentPopover($event: MouseEvent) {
    
  }

  removeItem(item: IWorkoutHistoryItem) {
    this._dataService.removeHistoryItem(item);
  }
}
