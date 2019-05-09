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

  constructor() { }

  ngOnInit() {
    this.startDate = new Date(Date.now());
    this.passedTime = TimeSpan.zero;
  }

  ngAfterViewInit(): void {
    this.start();
  }

  public reset() {
    this.startDate = new Date(Date.now());
    this.passedTime = TimeSpan.zero;
  }
  public start() {
    if(this.dateUpdater == 0)
      this.dateUpdater = <any>setInterval(this.updateDate.bind(this), 42);
  }

  private updateDate() {
    this.passedTime = new TimeSpan(new Date().getTime() - this.startDate.getTime());
  }

  public stop() {
    clearInterval(this.dateUpdater);
    this.dateUpdater = 0;
  }

  ngOnDestroy(): void {
    if(this.dateUpdater != 0)
      clearInterval(this.dateUpdater);
  }




}
