import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoanService } from '../shared/loan.service';
import { Storage } from '@ionic/storage';
import { Loan } from '../shared/loan';
import { AuthService } from '../shared/services/auth.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-loans',
  templateUrl: 'loans.page.html',
  styleUrls: ['loans.page.scss']
})
export class LoansPage {
  loans: Loan[];

  constructor(private loanService: LoanService, private AuthService: AuthService) {
    this.loanService.getLoanByUser()
      .subscribe(data => {
        this.loans = data;
      });


  }
}




