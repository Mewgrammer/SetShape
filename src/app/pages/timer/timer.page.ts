import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TimeSpan} from '../../resources/TimeSpan';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.page.html',
  styleUrls: ['./timer.page.scss'],
})
export class TimerPage implements OnInit, AfterViewInit {

  public passedTime: TimeSpan;
  public startDate: Date;
  public dateUpdater: number = 0;
  public targetTimeInput = "00:01:30";
  public targetTime: TimeSpan = TimeSpan.fromTime(0,1,30);
  public percent: number = 0;
  public radius: number = 100;

  constructor() { }

  ngOnInit() {
    this.startDate = new Date(Date.now());
    this.passedTime = TimeSpan.zero;
  }

  ngAfterViewInit(): void {
    this.start();
  }
  
  public reset() {
    this.percent = 0;
    this.startDate = new Date(Date.now());
    this.passedTime = TimeSpan.zero;
  }
  public start() {
    if(this.dateUpdater == 0)
      this.dateUpdater = <any>setInterval(this.updateDate.bind(this), 42);
  }
  
  private updateDate() {
    this.passedTime = new TimeSpan(new Date().getTime() - this.startDate.getTime());
    this.percent = Math.floor((this.passedTime.totalSeconds / this.targetTime.totalSeconds) * 100);
    console.log("Percent:", this.percent, this.passedTime.toString(), this.targetTime.toString());
  }
  
  public stop() {
    clearInterval(this.dateUpdater);
    this.dateUpdater = 0;
  }
  
  ngOnDestroy(): void {
    if(this.dateUpdater != 0)
      clearInterval(this.dateUpdater);
  }
  
  onTargetTimeChanged() {
    this.reset();
    const parts = this.targetTimeInput.split(":");
    console.log(parts);
    this.targetTime = TimeSpan.fromTime( parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
    console.log("Target Time Changed", this.targetTimeInput, this.targetTime.toString());
  }
}
