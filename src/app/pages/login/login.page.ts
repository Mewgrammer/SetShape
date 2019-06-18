import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	
	public loginUser: string = "";
	public loginPassword: string = "";
	
	public registerUser: string = "";
	public registerPassword: string = "";

  constructor(private _dataService: DataService, private _router: Router) { }

  async ngOnInit() {
  	this._dataService.onLogin.subscribe( async (value) => {
  		if(this._dataService.LoggedIn) {
  			console.log("OnLogin fired!");
				await this._router.navigateByUrl( "/home");
			}
		});
  	if(this._dataService.LoggedIn) {
			await this._router.navigateByUrl( "/home");
		}
  }
	
  public async onLogin() {
  	await this._dataService.login(this.loginUser, this.loginPassword);
		if(this._dataService.LoggedIn) {
			await this._router.navigateByUrl( "/home");
		}
	}
	
	public async onRegister() {
		await this._dataService.register(this.registerUser, this.registerPassword);
		if(this._dataService.LoggedIn) {
			await this._router.navigateByUrl("/home");
		}
	}
}
