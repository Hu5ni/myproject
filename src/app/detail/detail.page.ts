import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../shared/item';
import { Loan } from '../shared/loan';
import { LoanService } from '../shared/loan.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage {
  loan: Loan;
  loanID: string;
  items: Item []
  status:string;
  duedate: Date;

  constructor(private route: ActivatedRoute, private router: Router, private loanService: LoanService) {
    this.loanID = this.route.snapshot.params.loanID;

    

   // this.loanService.getAllLoans()
   // .subscribe(data => {
   //   this.loan = data;
   //   this.items = this.loan.items;

   // });
    this.loanService.getLoanById(this.loanID)
    .then(data=>{
      this.loan = data;
      this.status = this.loan.status;
      this.duedate = this.loan.duedate;
      this.items = this.loan.items;

    });

    

    
   }

   delete() {
    this.loanService.delete(this.loan);
    this.router.navigate(['tabs/loans']);
   }

   

}
