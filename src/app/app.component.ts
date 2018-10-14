import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import * as firebase from 'firebase/app';
import { environment } from '../environments/environment';

const {SplashScreen, StatusBar} = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    firebase.initializeApp(environment.firebase);
    SplashScreen.hide().catch(error => {
      console.error(error);
    });

    StatusBar.hide().catch(error => {
      console.error(error);
    });
  }
}
