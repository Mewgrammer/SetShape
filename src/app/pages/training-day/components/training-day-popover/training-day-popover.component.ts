import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-training-day-popover',
  templateUrl: './training-day-popover.component.html',
  styleUrls: ['./training-day-popover.component.scss'],
})
export class TrainingDayPopoverComponent implements OnInit {

  constructor(private _router: Router, public _ctrl: PopoverController) { }

  ngOnInit() {}

  public async navigateToAddPage() {
    await this._router.navigateByUrl(this._router.url + "/create");
    await this._ctrl.dismiss();
  }
}
