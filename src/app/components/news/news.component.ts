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

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  create: boolean = true;
  public news = [];
  downloadURL: any;
  images: Observable<any[]>;
  url: any;
  imagePath: string = "/news/be-creative-creative-drawing-256514.jpg";
  imageRef: any;
  targetFile: any;
  timeFinish: any;
  iduser: any;
  uid: any;
  idpublication: any;
  likesArray = new Array();
  // newArray: Observable<Array<{
  //     likes: number,
  //     dislike: number,
  //     iduser: string,
  //     time: number,
  //     title: string,
  //     description: string,
  //     image: any,
  //     idplant: string,
  //     idpublication: string,
  //     iddepartament: string,
  //     startDate: string,
  //     endDate: string
  //   }>>;
  public newArray: Array<{
    likes: number,
    dislike: number,
    iduser: string,
    time: number,
    title: string,
    description: string,
    image: any,
    idplant: string,
    idpublication: string,
    iddepartament: string,
    startDate: string,
    endDate: string
  }> = [];
  newsArray = new Array();
  notificacion = new Notification;

  // public newsArray: Array<{ title: string, description: string, image: any, idplant: string, idpublication: string, iddepartament: string, startDate: string, endDate: string, like: number, notlikes: number }> = [];

  constructor(private router: Router, private injector: Injector, public firebaseService: FirebaseService, public afStorage: AngularFireStorage, public auth: AuthService) { }

  ngOnInit() {
    // this.newsArray = new Array();
    this.getAllNews();
    this.auth.getUserData().subscribe(s => {
      this.uid = s.id;
      console.log(this.uid);
    });
  }
  getAllNews() {
    this.firebaseService.getNews().subscribe((result) => {
      this.newsArray = [];
      result.forEach((Data: any) => {
        var id = Data.payload.doc.id;
        this.idpublication = id;
        var aux = Data.payload.doc.data();
        aux.imgaux = aux.image;
        if (formatDate(new Date(), 'yyyy-MM-dd', 'en') == aux.endDate && formatDate(new Date(), 'hh:mm:ss', 'en')=='23:59:59') {
          var storageRef = this.afStorage.ref(aux.image);//  bloque de eliminacion de imagen del storage
          storageRef.delete();// fin del bloque de eliminacion
          this.firebaseService.deleteNew(id);// Eliminacion de un elemento del la tabla con solo el id
          console.log('se elimino a ', aux);
        } else {
          aux.key = id;
          aux.time = (moment(aux.endDate)).diff(moment(new Date()), 'days');
          this.newsArray.push(aux);
          var arraux = this.newsArray.sort((unaMascota, otraMascota) => unaMascota.title.localeCompare(otraMascota.title));
          this.newsArray = arraux;
        }
      });
    });

  }

  getContador(idus, idpu, reaccion) {
  }
  getLikes(admin,description, dislike, endDate, key, like, startDate, title, reaccion, img) {
    // console.log(description, dislike, endDate, key, like, startDate, title, reaccion, img);
    // console.log(reaccion);

    if (reaccion == 'like') {
      if (like.length >= 1) {
        let th=this;
        // for (var x = 0; x <= like.length - 1; x++) {
        // console.log(like[x], ' - ', this.uid);
        if (like.includes(th.uid) == true) {
          like = like.filter(function (i) { return i !== th.uid });
          let notif = <any>{
            admin:admin,
            key: key,
            description: description,
            dislike: dislike,
            like: like,
            endDate: endDate,
            image: img,
            startDate: startDate,
            title: title,
          };
          th.firebaseService.updateNew(key, notif);
        } else {
          if (dislike.includes(th.uid) == false) {
            like.push(th.uid);
            let notif = <any>{
              admin:admin,
              key: key,
              description: description,
              dislike: dislike,
              like: like,
              endDate: endDate,
              image: img,
              startDate: startDate,
              title: title,
            };
            th.firebaseService.updateNew(key, notif);
          } else if (dislike.includes(th.uid) == true) {
            dislike = dislike.filter(function (i) { return i !== th.uid });
            like.push(th.uid);
            let notif = <any>{
              admin:admin,
              key: key,
              description: description,
              dislike: dislike,
              like: like,
              endDate: endDate,
              image: img,
              startDate: startDate,
              title: title,
            };
            th.firebaseService.updateNew(key, notif);
          }
        }
        // }
      } else {
        let th=this;
        console.log('nuevo porque no hay nada');
        if (dislike.includes(th.uid) == false) {
          like.push(th.uid);
          let notif = <any>{
            admin:admin,
            key: key,
            description: description,
            dislike: dislike,
            like: like,
            endDate: endDate,
            image: img,
            startDate: startDate,
            title: title,
          };
          th.firebaseService.updateNew(key, notif);
        } else if (dislike.includes(th.uid) == true) {

          dislike = dislike.filter(function (i) { return i !== th.uid });
          like.push(th.uid);
          let notif = <any>{
            admin:admin,
            key: key,
            description: description,
            dislike: dislike,
            like: like,
            endDate: endDate,
            image: img,
            startDate: startDate,
            title: title,
          };
          th.firebaseService.updateNew(key, notif);
        }
      }
    } else if (reaccion == 'dislike') {
 let th=this;
      if (dislike.length >= 1) {

        if (dislike.includes(th.uid) == true) {
          dislike = dislike.filter(function (i) { return i !== th.uid });
          let notif = <any>{
            admin:admin,
            key: key,
            description: description,
            dislike: dislike,
            like: like,
            endDate: endDate,
            image: img,
            startDate: startDate,
            title: title,
          };
          th.firebaseService.updateNew(key, notif);
          ////break;
        } else {
          if (like.includes(th.uid) == false) {
            dislike.push(th.uid);
            let notif = <any>{
              admin:admin,
              key: key,
              description: description,
              dislike: dislike,
              like: like,
              endDate: endDate,
              image: img,
              startDate: startDate,
              title: title,
            };
            th.firebaseService.updateNew(key, notif);
            //////break;
          } else if (like.includes(this.uid) == true) {
            let th = this;

            like = like.filter(function (i) { return i !== th.uid });
            dislike.push(this.uid);
            let notif = <any>{
              admin:admin,
              key: key,
              description: description,
              dislike: dislike,
              like: like,
              endDate: endDate,
              image: img,
              startDate: startDate,
              title: title,
            };
            th.firebaseService.updateNew(key, notif);
            //////break;
          }

        }
        // x++;

    } else {
      let th=this;
      console.log('nuevo porque no hay nada');
      if (like.includes(th.uid) == false) {
        dislike.push(th.uid);
        let notif = <any>{
          admin:admin,
          key: key,
          description: description,
          dislike: dislike,
          like: like,
          endDate: endDate,
          image: img,
          startDate: startDate,
          title: title,
        };
        th.firebaseService.updateNew(key, notif);
      } else if (like.includes(th.uid) == true) {
        console.log(th.uid);
        like = like.filter(function (i) { return i !== th.uid });
        dislike.push(th.uid);
        let notif = <any>{
          admin:admin,
          key: key,
          description: description,
          dislike: dislike,
          like: like,
          endDate: endDate,
          image: img,
          startDate: startDate,
          title: title,
        };
        th.firebaseService.updateNew(key, notif);
      }
    }
  }
  }

recordNews(records) {
  console.log(records);
}

openCreateForm() {
  if (this.create == true) {
    this.create = false;

  } else {
    this.create = true;

  }
}

createNew(newsForm, value) {
  console.log(value);
  var creationDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  var extradata = {
    admin: this.uid,
    creationDate: creationDate
  };
  if (this.url != null) {
    // console.log(this.url);
    var imgRef = '/img/' + this.imageRef;
    this.afStorage.upload(imgRef, this.targetFile);
    this.afStorage.ref(imgRef).getDownloadURL().subscribe(downloadURL => {
      this.firebaseService.createNews(value, downloadURL, extradata)
        .then(
          res => {
            console.log(res);
          });
      // console.log(downloadURL);
    });
    console.log("imagen guardada?");


  }
  newsForm.reset();
  this.newsArray = new Array;
  this.router.navigate(['/home']);

}

getNews() {
  this.firebaseService.getNews()
    .subscribe(result => {
      console.log(result);
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

}
