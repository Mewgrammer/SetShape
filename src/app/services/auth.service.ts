import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  public get Authenticated() {
    return false;
  }
  constructor() { }
}
