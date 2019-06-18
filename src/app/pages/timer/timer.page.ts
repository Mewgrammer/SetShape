import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TimeSpan} from '../../resources/TimeSpan';
import {Vibration, VibrationOriginal} from '@ionic-native/vibration';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.page.html',
  styleUrls: ['./timer.page.scss'],
})
export class TimerPage implements OnInit, AfterViewInit {

  public passedTime: TimeSpan;
  public pausedTime: TimeSpan;
  public pausedDate: Date;
  public startDate: Date;
  public dateUpdater: number = 0;
  public targetTimeInput = "00:01:30";
  public targetTime: TimeSpan = TimeSpan.fromTime(0,1,30);
  public percent: number = 0;
  public radius: number = 100;

  constructor(public _dataService: DataService) { }

  ngOnInit() {
    this.reset();
  }

  ngAfterViewInit(): void {
    this.start();
  }
  
  public reset() {
    this.percent = 0;
    this.startDate = new Date();
    this.pausedDate = new Date();
    this.passedTime = TimeSpan.zero;
    this.pausedTime = TimeSpan.zero;
  }
  public start() {
    this.pausedTime = this.pausedTime.add(new TimeSpan( new Date().getTime() - this.pausedDate.getTime()));
    if(this.dateUpdater == 0)
      this.dateUpdater = <any>setInterval(this.updateDate.bind(this), 42);
  }
  
  private updateDate() {
    this.passedTime = new TimeSpan(new Date().getTime() - this.startDate.getTime()).subtract(this.pausedTime);
    this.percent = Math.floor((this.passedTime.totalSeconds / this.targetTime.totalSeconds) * 100);
    if(this.percent == 100) {
      Vibration.vibrate([500, 500, 500, 500, 500, 500, 500, 500, 500]);
    }
  }
  
  public stop() {
    this.pausedDate = new Date();
    clearInterval(this.dateUpdater);
    this.dateUpdater = 0;
    Vibration.vibrate(0);
  }
  
  ngOnDestroy(): void {
    if(this.dateUpdater != 0)
      clearInterval(this.dateUpdater);
  }
  
  onTargetTimeChanged() {
    this.reset();
    const parts = this.targetTimeInput.split(":");
    this.targetTime = TimeSpan.fromTime( parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
  }
  
  onTimerClick() {
    if(this.dateUpdater == 0) {
      this.start();
    }
    else {
      this.stop();
    }
  }
}
