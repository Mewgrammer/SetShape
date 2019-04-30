import { Component, OnInit } from '@angular/core';
import {EWorkoutType, IWorkout, IWorkoutHistoryItem} from '../../resources/models/workout';
import {DataService} from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-workout-history',
  templateUrl: './workout-history.page.html',
  styleUrls: ['./workout-history.page.scss'],
})
export class WorkoutHistoryPage implements OnInit {

  public history: IWorkoutHistoryItem[] = [];
  private workoutType: EWorkoutType;

  constructor(private _dataService: DataService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    try{
      this.workoutType = <EWorkoutType>parseInt(this.route.snapshot.paramMap.get('type'));
      console.log("History - WorkoutType:", this.workoutType);
      if(this.workoutType != null) {
        this.history = this._dataService.WorkoutHistory.filter(w => w.workout.type == this.workoutType);
        console.log("History:", this.history);
      }
    }
    catch (e) {
      console.error(e);
    }
  }


  presentPopover($event: MouseEvent) {
    
  }
}
