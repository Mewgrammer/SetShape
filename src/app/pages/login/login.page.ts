import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	
	loginUser: string;
	loginPassword: string;
	
	registerUser: string;
	registerPassword: string;

  constructor(private _dataService: DataService, private _router: Router) { }

  ngOnInit() {
  }
	
  public async onLogin() {
  	await this._dataService.login(this.loginUser, this.loginPassword);
		if(this._dataService.LoggedIn) {
			await this._router.navigateByUrl(this._router.url + "/home");
		}
	}
	
	public async onRegister() {
		await this._dataService.register(this.loginUser, this.loginPassword);
		if(this._dataService.LoggedIn) {
			await this._router.navigateByUrl(this._router.url + "/home");
		}
	}
}
