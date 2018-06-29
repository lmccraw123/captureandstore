import { Component } from '@angular/core';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  cordova:any;

  constructor(
    public navCtrl: NavController, 
    private camera: Camera, 
    private transfer: FileTransfer, 
    private file: File, 
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController    
  ) {

  }

  options: CameraOptions = {
    quality: 100,
    sourceType: sourceType,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  onCamera(){
  this.camera.getPicture(this.options).then((imageData) => {
   // imageData is either a base64 encoded string or a file URI
   // If it's base64 (DATA_URL):
   if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
    this.filePath.resolveNativePath(imagePath)
      .then(filePath => {
        let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
        let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      });
  } else {
    var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
    var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
    this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
  }
   let base64Image = 'data:image/jpeg;base64,' + imageData;
  }, (err) => {
   // Handle error
  });
}

const fileTransfer: FileTransferObject = this.transfer.create();

// Upload a file:
fileTransfer.upload(..).then(..).catch(..);

// Download a file:
fileTransfer.download(..).then(..).catch(..);

// Abort active transfer:
fileTransfer.abort();

// full example
upload() {
  let options: FileUploadOptions = {
     fileKey: 'file',
     fileName: 'name.jpg',
     headers: {}
     .....
  }

  fileTransfer.upload('<file path>', '<api endpoint>', options)
   .then((data) => {
     // success
   }, (err) => {
     // error
   })
}
*
download() {
  const url = 'http://www.example.com/file.pdf';
  fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
    console.log('download complete: ' + entry.toURL());
  }, (error) => {
    // handle error
  });
}

onFilePath(){
  this.filePath.resolveNativePath(path)
  .then(filePath => console.log(filePath))
  .catch(err => console.log(err));
}


//option to choose to upload via library or camera 
public presentActionSheet() {
  let actionSheet = this.actionSheetCtrl.create({
    title: 'Select Image Source',
    buttons: [
      {
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
    ]
  });
  actionSheet.present();
}
}

2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
public takePicture(sourceType) {
  // Create options for the Camera Dialog
  var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };
 
  // Get the data of an image
  this.camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && this.sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
    } else {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }
  }, (err) => {
    this.presentToast('Error while selecting image.');
  });
}

// Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}
 
// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
  }, error => {
    this.presentToast('Error while storing file.');
  });
}
 
private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}
 
// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}

}
