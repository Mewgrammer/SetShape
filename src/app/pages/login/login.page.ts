import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';
import {LoadingController, ToastController} from '@ionic/angular';
import {load} from '@angular/core/src/render3';

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

	private _loading: any;
	
  constructor(private _dataService: DataService, private _router: Router, public loadingController: LoadingController, private _toaster: ToastController) { }

  async ngOnInit() {
  	this._dataService.onLogin.subscribe( async (value) => {
  		if(this._dataService.LoggedIn) {
  			console.log("OnLogin fired!");
				await this.cancelLoading();
				await this._router.navigateByUrl( "/home");
			}
		});
  	if(this._dataService.LoggedIn) {
  		await this.cancelLoading();
  		await this._router.navigateByUrl( "/home");
		}
  }
  
  private async cancelLoading() {
  	try {
			if(this._loading != null){
				await this._loading.dismiss();
			}
		}
		catch (e) {
			console.warn("Error on cancelLoading:", e);
		}

	}
	
  public async onLogin() {
		this.presentLoadingPopup().then( () => console.log("Present LoadingPopup"));
  	await this._dataService.login(this.loginUser, this.loginPassword);
		if(this._dataService.LoggedIn) {
			await this.cancelLoading();
			await this._router.navigateByUrl( "/home");
		}
		else {
			await this.cancelLoading();
		}
	}
	
	public async onRegister() {
		this.presentLoadingPopup().then( () => console.log("Present LoadingPopup"));
		await this._dataService.register(this.registerUser, this.registerPassword);
		if(this._dataService.LoggedIn) {
			await this.cancelLoading();
			await this._router.navigateByUrl("/home");
		}
		else {
			await this.cancelLoading();
		}
	}
	private async presentLoadingPopup() {
		this._loading = await this.loadingController.create({
			duration: 15000,
			message: 'Bitte warten...',
			cssClass: ''
		});
		return await this._loading.present();
	}

}
