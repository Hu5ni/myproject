import { Component } from '@angular/core';
import { Loan } from '../shared/loan';
import firebase from 'firebase/app';
import { LoanService } from '../shared/loan.service';

@Component({
  selector: 'app-manage',
  templateUrl: 'manage.page.html',
  styleUrls: ['manage.page.scss']
})
export class ManagePage {
  loan: Loan[];

  constructor(private loanService: LoanService) {
    this.loanService.getAllLoans().subscribe(data => {
      this.loan = data;
    })
   }

   approve(L:Loan){
    this.loanService.approve(L);
   }

   reject(L:Loan){
    this.loanService.reject(L);
   }

}
