import { Component } from '@angular/core';
import firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  platform: any;
  constructor() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyACRtItK2UerailnfApiYMLo4MBwTbP56k",
      authDomain: "msa-assignment-6b8d1.firebaseapp.com",
      projectId: "msa-assignment-6b8d1",
      storageBucket: "msa-assignment-6b8d1.appspot.com",
      messagingSenderId: "334314490780",
      appId: "1:334314490780:web:08f8615b0a6fab0b541659"
    };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  }

  initializeApp(){

    this.platform.ready().then(() => {
});
  }

}


