import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  userEmail: string;
  loginError: string;


  constructor(private router: Router, private authService: AuthService) {
    this.authService.observeAuthState(user => {
      if (user) {
        this.userEmail = user.email;
      }
      else {
        this.userEmail = undefined;
      }

    });
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });

  }

  login() {
    // TODO: Based on user role go to different page
    this.authService.login(
      this.loginForm.value.email,
      this.loginForm.value.password)
      .then(
        user => this.router.navigate(['/tabs/new-loan'])
      )
      .catch(
        error => this.loginError = error.message
      );

  }
}
