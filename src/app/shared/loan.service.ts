import { Injectable } from '@angular/core';
import { Item } from './item';
import { Loan } from './loan';
import { Observable } from 'rxjs';
import 'firebase/firestore';
import firebase from 'firebase/app';
import { AuthService } from './services/auth.service';



@Injectable({
  providedIn: 'root'
})
export class LoanService {
  userEmail: string;

  constructor(private authService: AuthService) { 



    this.authService.observeAuthState(user => {
      // User is logged in
      if (user) {
      this.userEmail = user.email;
      }
      // User has logged out
      else {
      this.userEmail = undefined;
      }
      });
  }

  createLoan(items: Item[]) {

    // Due date is 2 weeks after today 
    let duedate = new Date(); // Today
    duedate.setHours(0, 0, 0, 0); // Midnight
    duedate.setDate(duedate.getDate() + 14); // 2 weeks later

    // TODO: Get username logged in
    let loan = new Loan('amy@nyp.sg', 'pending', duedate);

    // Add to collection '/loans/<autoID>' 
    return firebase.firestore().collection('loans').add({
      username: loan.username,
      status: loan.status,
      duedate: loan.duedate
    }).then(doc => {
      loan.id = doc.id;
      // Add to collection '/loans/<autoID>/items/'
      for (let item of items) {
        if (item.quantity > 0) {
          // Add a new document '/loans/<autoID>/items/<itemID>'
          firebase.firestore().collection('loans/' + doc.id + '/items/').doc(item.id).set({
            quantity: item.quantity
          });
        }
      }
      return loan;
    })

  }

  

  getAllLoans(): Observable<any> {
    return new Observable(observer => {
      // Read collection '/loans'
      firebase.firestore().collection('loans').where("status","==","pending").onSnapshot(collection => {
        let array = [];
        collection.forEach(doc => {

          // Add loan into array if there's no error
          try {
            let loan = new Loan(doc.data().username, doc.data().status, doc.data().duedate.toDate(), doc.id);
            array.push(loan);

            // Read subcollection '/loans/<autoID>/items'
            let dbItems = firebase.firestore().collection('loans/' + doc.id + '/items');
            dbItems.onSnapshot(itemsCollection => {
              loan.items = []; // Empty array
              itemsCollection.forEach(itemDoc => {
                let item = new Item(itemDoc.id, itemDoc.data().quantity);
                loan.items.push(item);
              });
            });
          } catch (error) { }

        });
        observer.next(array);
      });
    });
  }
  getLoanByUser(): Observable<any> {
    return new Observable(observer => {
      // Read collection '/loans'
      firebase.firestore().collection('loans').orderBy('duedate').where("username","==",this.userEmail).onSnapshot(collection => {
        let array = [];
        collection.forEach(doc => {

          // Add loan into array if there's no error
          try {
            let loan = new Loan(doc.data().username, doc.data().status, doc.data().duedate.toDate(), doc.id);
            array.push(loan);

            // Read subcollection '/loans/<autoID>/items'
            let dbItems = firebase.firestore().collection('loans/' + doc.id + '/items');
            dbItems.onSnapshot(itemsCollection => {
              loan.items = []; // Empty array
              itemsCollection.forEach(itemDoc => {
                let item = new Item(itemDoc.id, itemDoc.data().quantity);
                loan.items.push(item);
              });
            });
          } catch (error) { }

        });
        observer.next(array);
      });
    });
  }

  delete(I: Loan) {
    const ref = firebase.firestore().collection("loans").doc(I.id);
    ref.get().then(doc => {
      if (doc.exists)
        ref.delete();
    });
  }


  approve(L: Loan){
    const ref = firebase.firestore().collection("loans").doc(L.id)
    ref.update({
      status:'approved'
    })
  }

  reject(L: Loan){
    const ref = firebase.firestore().collection("loans").doc(L.id);
    ref.update({
      status:'rejected'
    });
  }


  getLoanById(id: string){
    // Read document '/loans/<id>'
    return firebase.firestore().collection('loans').doc(id).get().then(doc => {
      let loan = new Loan(doc.data().username, doc.data().status, doc.data().duedate.toDate(), doc.id);

      // Read subcollection '/loans/<id>/items'
      return firebase.firestore().collection('loans/' + id + '/items').get().then(collection => {
        loan.items = []; // Empty array
        collection.forEach(doc => {
          let item = new Item(doc.id, doc.data().quantity);
          loan.items.push(item);
        })
        return loan;
      });
    });
  }

}
