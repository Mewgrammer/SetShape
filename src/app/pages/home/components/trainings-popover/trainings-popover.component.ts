import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';
import {DataService} from '../../../../services/data.service';

@Component({
  selector: 'app-trainings-popover',
  templateUrl: './trainings-popover.component.html',
  styleUrls: ['./trainings-popover.component.scss'],
})
export class TrainingsPopoverComponent implements OnInit {

  constructor(private _dataService: DataService, private _router: Router, public _ctrl: PopoverController) { }

  ngOnInit() {}

  public async navigateToAddPage() {
    await this._router.navigateByUrl(this._router.url + "/add");
    await this._ctrl.dismiss();
  }

  public async navigateToChangePage() {
    await this._router.navigateByUrl(this._router.url + "/change");
    await this._ctrl.dismiss();
  }
	
	public async logout() {
		await this._dataService.Logout();
    await this._router.navigateByUrl("/");
	}
}
