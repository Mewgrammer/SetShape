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

  public percent: number = 0;
  public radius: number = 100;
  public fulltime: any = '00:01:30'; //default rest time
  public timer: any = false;
  public progress: any = 0;
  public minutes: number = 1;
  public seconds: any = 30;
  public overallTimer: any = false;

  elapsed: any = {
    h: '00',
    m: '00',
    s: '00',
  }

  constructor() { }

  ngOnInit() {
    this.startDate = new Date(Date.now());
    this.passedTime = TimeSpan.zero;
  }

  ngAfterViewInit(): void {
  }

  public startTimer() {

    if(this.timer) {
      clearInterval(this.timer);
    }

    if(!this.overallTimer) {
      this.progressTimer();
    }

    this.timer = false;
    this.percent = 0;
    this.progress = 0;

    let timeSplit = this.fulltime.split(':');
    this.minutes = timeSplit[1];
    this.seconds = timeSplit[2];

    let totalSeconds = Math.floor(this.minutes * 60) + parseInt(this.seconds);

    this.timer = setInterval(() => {
      if(this.percent == this.radius) {
        clearInterval(this.timer);
        // redirect back to training page?
      }
      this.percent = Math.floor((this.progress / totalSeconds) * 100);
      this.progress++;
    }, 1000);
  }

  public progressTimer() {
    let countDownDate = new Date();

    this.overallTimer = setInterval(() => {
      let now = new Date().getTime();
      let distance = now - countDownDate.getTime();

      this.elapsed.h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.elapsed.m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.elapsed.s = Math.floor((distance % (1000 * 60)) / (1000));

      this.elapsed.h = this.pad(this.elapsed.h, 2);
      this.elapsed.m = this.pad(this.elapsed.m, 2);
      this.elapsed.s = this.pad(this.elapsed.s, 2);

    }, 1000);
  }

  public pad(num, size) {
    let s = num+"";
    while(s.length<size) s = "0" + s;
    return s;
  }

  public stopTime() {
    clearInterval(this.timer);
    clearInterval(this.overallTimer);
    this.overallTimer = false;
    this.timer = false;
    this.percent = 0;
    this.progress = 0;
    this.elapsed = {
      h: '00',
      m: '00',
      s: '00'
    }

  }

  ngOnDestroy(): void {
    if(this.dateUpdater != 0)
      clearInterval(this.dateUpdater);
  }




}
