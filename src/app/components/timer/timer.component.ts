import {Component, OnDestroy, OnInit} from '@angular/core';
import {TimeSpan} from '../../resources/TimeSpan';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {

  public passedTime: TimeSpan;
  public startDate: Date;
  private dateUpdater: number = 0;

  constructor() { }

  ngOnInit() {
    this.startDate = new Date(Date.now());
    this.passedTime = TimeSpan.zero;
  }

  public reset() {
    this.startDate = new Date(Date.now());
    this.passedTime = TimeSpan.zero;
  }
  public start() {
    if(this.dateUpdater == 0)
      this.dateUpdater = setInterval(this.updateDate.bind(this), 42);
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
