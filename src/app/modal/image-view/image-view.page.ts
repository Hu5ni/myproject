import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import firebase from 'firebase';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.page.html',
  styleUrls: ['./image-view.page.scss'],
})
export class ImageViewPage implements OnInit {
  @Input() image: string;
  @Input() file: any;

  constructor(private modalController: ModalController,
    private toastController: ToastController,
    public loadingController: LoadingController,
    ) {
    console.log(this.image);
  }

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }

  upload() {
    this.openLoader()
    let uid = firebase.auth().currentUser.uid
    const fileStoragePath = `profilePicture/${uid}`;

    const imageRef = firebase.storage().ref(fileStoragePath);
    imageRef.put(this.file).then((e) => {
      
      e.ref.getDownloadURL().then(e => {
          console.log(e)
          firebase.auth().currentUser.updateProfile({
            photoURL: e,
          });
        }).then(e => {
          this.closeLoading()
          this.close()
          this.presentToast('Profile Picture uploaded',  'bottom', 1000);
    
        }).catch(e => {
          this.close()
          this.closeLoading()
          this.presentToast('Error occured!',  'bottom', 1000);
    
        })
      }).catch(e => {
        this.closeLoading()
        this.presentToast('Error occured!',  'bottom', 1000);
      })
   
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

}
