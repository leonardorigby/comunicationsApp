
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, Injector, NgZone } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { Notification } from '../models/Notification';
import * as moment from 'moment';
import { Likes } from '../models/Likes';
import { Auxuser } from '../models/AuxUser';
import { Metrico } from '../models/Metrico';
import { element } from 'protractor';
import { DomSanitizer } from '@angular/platform-browser';
// import YouTubePlayer from 'youtube-player';
import { User } from './../models/user.model';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';



@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  url: any;
  imageRef: any;
  targetFile: any;
  uid: any;
  uname: any;
  unumber: any;
  uimg: any;
  urlimg:any;
  uss:any;

  constructor(private router: Router, public firebaseService: FirebaseService, public afStorage: AngularFireStorage, public auth: AuthService) { }


  ngOnInit() {
    this.auth.getUserData().subscribe(s => {
      this.uid = s.id;
      this.uname = s.fullName;
      this.unumber = s.employeeNumber;
      this.uimg = s.image;
      this.uss = {
        id : s.id,
        name : s.fullName,
        number : s.employeeNumber,
        img : s.image,
      }
    });

  }
  loadImage(event) {
    // console.log(event);
    // console.log(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      this.targetFile = event.target.files[0];
      this.imageRef = event.target.files[0].name;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }

  }

  createNew(newsForm, value) {
    console.log(value);
    var creationDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    var extradata = {
      admin:{
        id:this.uid,
        image:this.uimg,
        name:this.uname,
        number:this.unumber
      },
      creationDate: creationDate
    };

    if (this.url != null ) {
      var imgRef = '/img/' + this.imageRef;
      this.afStorage.upload(imgRef, this.targetFile).then(r => {
        this.afStorage.ref(imgRef).getDownloadURL().subscribe(downloadURL => {
          this.firebaseService.createNews(value, downloadURL, extradata)
            .then(
              res => {
                console.log(res);
              });

        });
        console.log("imagen guardada?");
      });
    }else{
      this.firebaseService.createNews(value, "", extradata)
            .then(
              res => {
                console.log(res);
              });
    }
    newsForm.reset();
    // this.newsArray = new Array;
    this.router.navigate(['/home']);

  }

}
