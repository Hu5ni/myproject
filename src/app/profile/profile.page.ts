import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import firebase from 'firebase/app';
import { ModalController } from '@ionic/angular';
import { ImageViewPage } from '../modal/image-view/image-view.page';
import { Observable } from 'rxjs';

import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})


export class ProfilePage implements OnInit {
  @ViewChild("uploader", {static: true}) uploader: ElementRef<HTMLInputElement>;
  fileUploadedPath: Observable<string>;
  files: Observable<File[]>;

  user = {};
  username = ""
  email = ""
  profile = ""
  error = ""
  constructor(public alertController: AlertController,
    private toastController: ToastController,
    public loadingController: LoadingController,
    private modalCtrl: ModalController,
    private _sanitizer: DomSanitizer
    ) { 


    

  }

  ngOnInit() {
    
    this.username = firebase.auth().currentUser.displayName
    this.email = firebase.auth().currentUser.email
    this.user = firebase.auth().currentUser
    this.profile = firebase.auth().currentUser.photoURL
    console.log(this.user)
  }


  buttonUser() {
    this.showPrompt()
    this.error = '';
  }

  


  buttonEmail(){
  this.showPromptEmail()
  this.error = '';
  }

  buttonPassword() {
    this.showPromptPass()
    this.error = '';
  }

 

  updateUsername(username) {
    this.openLoader()

    firebase.auth().currentUser.updateProfile({
      displayName: username
    })
    .then((data) => {
      this.username = username;
      this.presentToast('Username updated',  'bottom', 1000);
      this.closeLoading()
      console.log(firebase.auth().currentUser)
      this.error = '';
    })
    .catch(err => {
      console.log(` failed ${err}`);
      this.error = err.message;
      this.closeLoading()
    });
  }


  async presentToast(message, position, duration) {
    const toast = await this.toastController.create({
      message,
      duration,
      position
    });
    toast.present();
  }


  async openLoader() {
    const loading = await this.loadingController.create({
      message: 'Please Wait ...',
      duration: 2000
    });
    await loading.present();
  }
  async closeLoading() {
    return await this.loadingController.dismiss();
  }

  updateEmail(email) {
    firebase.auth().currentUser.updateEmail(email)
      .then(() => {
        this.email = email;
        this.presentToast('Email updated',  'bottom', 1000);
        this.error = '';
      })
      .catch(err => {
        console.log(` failed ${err}`);
        this.error = err.message;
      });
  }



  showPromptEmail() {
    this.alertController.create({
      header: 'Update Email',
      message: 'Enter your new Email Address',
      inputs: [
        {
          name: 'email',
          placeholder: 'John@email.com',
          
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Update!',
          handler: (data: any) => {
            console.log('Saved Information', data);
            
            this.updateEmail(data.email)

          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }



  showPrompt() {
    this.alertController.create({
      header: 'Update Username',
      message: 'Enter your new username',
      inputs: [
        {
          name: 'username',
          placeholder: 'Eg.John Doe',
          
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Update!',
          handler: (data: any) => {
            console.log('Saved Information', data);
            
            this.updateUsername(data.username)

          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  showPromptPass() {
    this.alertController.create({
      header: 'Update Password',
      message: 'Enter your new username',
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password',
          label: 'Password'
          
        },
        {
          name: 'confirmpass',
          placeholder: 'Confirm Password',
          type: 'password',
          label: 'Confirm Password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Update!',
          handler: (data: any) => {
            console.log('Saved Information', data);
            if (data.password === data.confirmpass) {
              this.updatePassword(data.password)
            } else {
              this.presentToast('Password does not match!',  'bottom', 1000);
            }
          
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }


  updatePassword(password) {
    firebase.auth().currentUser.updatePassword(password)
      .then(() => {
        this.presentToast('Password updated', 'bottom', 1000);
        this.error = '';
      })
      .catch(err => {
        console.log(` failed ${err}`);
        this.error = err.message;
      });
  }

  fileUpload(event: FileList) {
      

    const file = event.item(0)

    if (file.type.split('/')[0] !== 'image') { 
      console.log('File type is not supported!')
      return;
    }
    console.log(file)
    var img = URL.createObjectURL(file)

    let img3 = this._sanitizer.bypassSecurityTrustUrl(img);
    // let reader = new FileReader();
    // reader.onload = (event:any) => {
      
      this.presentModal(img3, file)

}

popFileChooser() {
  this.uploader.nativeElement.click();
// this.presentModal("ds")
}

async presentModal(image, file) {
  const modal = await this.modalCtrl.create({
    component: ImageViewPage,
    componentProps: {
      image: image,
      file: file
    },
  })
  modal.onDidDismiss().then(() => {
    console.log('dsds')
    this.updateProfile() 
  });
  await modal.present();
}

updateProfile() {
  
  setTimeout(() => {
    this.profile = firebase.auth().currentUser.photoURL
  },2000)
}

}
