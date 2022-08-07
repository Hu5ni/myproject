import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import firebase from 'firebase';
import 'firebase/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {


  }

  observeAuthState(func) {
    return firebase.auth().onAuthStateChanged(func);
  }

  login(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  

  logout() {
    return firebase.auth().signOut();
  }

}

