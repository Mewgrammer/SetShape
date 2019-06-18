import { Component, OnInit } from '@angular/core';
import {Workout} from '../../resources/ApiClient';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {

  
  constructor(private dataService: DataService) { }

  ngOnInit() {
  }
  
  public getStudioVisitCount() {
    return 42;
  }
  
  public getCompletedWorkoutCount() {
    let sum = 0;
    this.dataService.User.trainings.forEach( t => {
      t.days.forEach(d => {
        sum += d.history.length;
      });
    });
    return sum;
  }
  
  public getWorkoutCount(workoutName: string) {
    const  workout = this.dataService.Workouts.find(w => w.name == workoutName);
    if(workout == null) return 0;
    let sum = 0;
    this.dataService.User.trainings.forEach( t => {
      t.days.forEach(d => {
        sum += d.history.filter(h => h.workout.id == workout.id).length;
      });
    });
    return sum;
  }
  
  public getWeightSumOfWorkout(workoutName: string) {
    const  workout = this.dataService.Workouts.find(w => w.name == workoutName);
    if(workout == null) return 0;
    let sum = 0;
    this.dataService.User.trainings.forEach( t => {
      t.days.forEach(d => {
        d.history.filter(h => h.workout.id == workout.id).forEach(h => {
          sum += h.weight;
        });
      });
    });
    return sum;
  }
  
  public getAverageWeightOfWorkout(workoutName: string) {
    const  workout = this.dataService.Workouts.find(w => w.name == workoutName);
    if(workout == null) return 0;
    let sum = 0;
    let count = 0;
    this.dataService.User.trainings.forEach( t => {
      t.days.forEach(d => {
        d.history.filter(h => h.workout.id == workout.id).forEach(h => {
          count++;
          sum += h.weight;
        });
      });
    });
    return sum / count;
  }

}
