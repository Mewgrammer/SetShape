import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss'],
})
export class AddTrainingComponent implements OnInit
{
  constructor(private _router: Router,) { }

  ngOnInit() {}


  async onCreateTrainingManual() {
    await this._router.navigateByUrl(this._router.url + "/manual");
  }

  async onGenerateTraining() {
    await this._router.navigateByUrl(this._router.url + "/generate");
  }
}
