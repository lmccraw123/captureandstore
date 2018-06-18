import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the StoragePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-storage',
  templateUrl: 'storage.html',
})
export class StoragePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage
      ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoragePage');
  }

   // set a key/value
   storage.set('name', 'Max');

   // Or to get a key/value pair
   storage.get('age').then((val) => {
     console.log('Your age is', val);
   });
 }

}
