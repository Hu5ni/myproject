import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  isUser = false;
  isManager = false;

  constructor(private authService: AuthService) {
    this.authService.observeAuthState(user => {
      if (user && user.email == 'manager@nyp.sg') {
        this.isManager = true;
      }
      else {
        this.isUser = true;
      }
    });
  }

}
