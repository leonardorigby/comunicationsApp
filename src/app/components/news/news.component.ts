import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, Injector,NgZone } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { Notification } from '../models/Notification';
import * as moment from 'moment';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  create: boolean = false;
  public news = [];
  downloadURL: any;
  images: Observable<any[]>;
  url: any;
  imagePath: string = "/news/be-creative-creative-drawing-256514.jpg";
  imageRef: any;
  targetFile: any;
  timeFinish: any;
  // public newsArray: Array<{
  //   like: number,
  //   dislike: number,
  //   iduser: string,
  //   time: number,
  //   title: string,
  //   description: string,
  //   image: any,
  //   idplant: string,
  //   idpublication: string,
  //   iddepartament: string,
  //   startDate: string,
  //   endDate: string
  // }> = [];
  newsArray = new Array();
  notificacion = new Notification;
  reaccionPublication: any;
  uid: any;
  uniqs: any;

  // public newsArray: Array<{ title: string, description: string, image: any, idplant: string, idpublication: string, iddepartament: string, startDate: string, endDate: string, like: number, notlikes: number }> = [];

  constructor( private router: Router,private injector: Injector,public firebaseService: FirebaseService, public afStorage: AngularFireStorage, public auth: AuthService) { }

  ngOnInit() {
    this.getAllNews();
    // this.firebaseService.getUsers().subscribe(r => {
    //   this.uid = r[0].payload.doc.id;
    // });


    this.auth.getUserData().subscribe(s => {
      this.uid = s.id;
      // console.log(this.uid);
    });
    // console.log(this.uid);
  }
  getAllNews() {

    this.firebaseService.getLikes().subscribe(lik => {
      this.newsArray = new Array();
      this.firebaseService.getNews().subscribe((result) => {
        this.newsArray = new Array();

        result.forEach((newsData: any) => {
          this.notificacion = new Notification;
          // console.log('< 8888 >');
          var id = newsData.payload.doc.id;
          var data = newsData.payload.doc.data();
          this.notificacion.likes = 0;
          this.notificacion.dislike = 0;
          this.afStorage.ref(data.image).getDownloadURL().subscribe(downloadURL => {
            var megusta = 0, nomegusta = 0, m1 = 0, m2 = 0;

            if (formatDate(new Date(), 'yyyy-MM-dd', 'en') == data.endDate) {
              var storageRef = this.afStorage.ref(data.image);//  bloque de eliminacion de imagen del storage
              storageRef.delete();// fin del bloque de eliminacion
              this.firebaseService.deleteNew(id);// Eliminacion de un elemento del la tabla con solo el id
              console.log('se elimino a ', data);
            } else {
              // console.log("no elimino");
              var idaux = id;
              var arrlikes = new Array();
              lik.forEach(da => {
                // console.log('< dupl>');
                var xx = 0;
                var dat = da.payload.doc.data();
                arrlikes.push(dat);
                for (xx = 0; xx < arrlikes.length; xx++) {
                  if (arrlikes[xx].idpublication == id) {
                    console.log("aqui");
                    if (arrlikes[xx].dislike == false && arrlikes[xx].like == true) {
                      megusta = megusta + 1;
                      m1 = megusta;
                      // console.log("un me gusta mas ", megusta);
                      megusta = 0;
                      break;
                    } else if (arrlikes[xx].dislike == true && arrlikes[xx].like == false) {
                      nomegusta = nomegusta + 1;
                      m2 = nomegusta;
                      // console.log("un no gusta mas ", nomegusta);
                      nomegusta = 0;
                      break;
                    }
                    break;
                  } else if (arrlikes[xx].dislike == false && arrlikes[xx].like == false) {
                    megusta = 0;
                    nomegusta = 0;
                    break
                  }

                }

              });
              this.notificacion.likes = m1;
              this.notificacion.dislike = m2;
              this.notificacion.iduser = this.uid;
              this.notificacion.time = (moment(data.endDate)).diff(moment(new Date()), 'days');
              this.notificacion.title = data.title;
              this.notificacion.description = data.description;
              this.notificacion.image = downloadURL;
              this.notificacion.idplant = data.idplant;
              this.notificacion.startDate = data.startDate;
              this.notificacion.endDate = data.endDate;
              this.notificacion.iddepartament = data.iddepartament;
              this.notificacion.idpublication = idaux;
              this.newsArray.push(this.notificacion);
              this.notificacion = new Notification;
              megusta = 0;
              nomegusta = 0;
            }
          });
        });
        console.log(this.newsArray);

      });
    }); //-----------------------
  }
  getRefresh(idpu, idus) {
    this.firebaseService.getLikes().subscribe(lik => {
      var x = 0;
      lik.forEach(da => {
        var dat = new Array;
        dat.push(da.payload.doc.data());
        try {
          if (idpu == dat[x].idpublication && idus == dat[x].iduser) {
            console.log("publicacion ", idpu, ' ', x);
          } else {
            console.log("publicacion no", idpu, ' ', x);
          }
        } catch (error) {
        }
        x++;
      });
    });
    this.getAllNews();
  }
  getLikes(idus, idpu, reaccion) {
    this.newsArray = new Array();
    this.newsArray = new Array();
    var l = {
      idpublication: idpu,
      iduser: idus,
      like: false,
      dislike: false,
    }
    this.firebaseService.getLikes().subscribe(result => {
      if (result.length == 0) {
        if (reaccion == 'like') {
          l.like = true;
          reaccion = null;
          l.dislike = false;
          this.firebaseService.getNewLikes(l);
        } else if (reaccion == 'dislike') {
          l.like = false;
          reaccion = null;
          l.dislike = true;
          this.firebaseService.getNewLikes(l);
        }
      } else {
        console.log('simon');
        if (idpu == null && idus == null) {
        } else {
          var bandera = false;
          var values = new Array();
          for (var x = 0; x < result.length; x++) {
            values.push(result[x].payload.doc.data());
            var key = result[x].payload.doc.id;
            try {
              // console.log(values[x].idpublication + " " + idpu + " - " + values[x].iduser + " " + idus);
              if ((values[x].idpublication == idpu) && (values[x].iduser == idus)) {
                bandera = true;
                console.log('es la misma publicacion');
                var val = new Array();
                this.firebaseService.getLikeById(key).subscribe(r => {
                  val.push(r.payload.data());
                  if (reaccion == "like" && val[0].like == false) {
                    l.like = true;
                    l.dislike = false;
                    this.firebaseService.updateLikes(key, l);
                    idpu = null;
                    reaccion = null;
                    idus = null;
                    console.log('fue un like');
                  } else if (reaccion == "like" && val[0].like == true) {
                    l.like = false;
                    l.dislike = false;
                    this.firebaseService.updateLikes(key, l);
                    idpu = null;
                    reaccion = null;
                    idus = null;
                    console.log('fue un dislikeke');
                  } else if (reaccion == "dislike" && val[0].dislike == false) {
                    l.like = false;
                    l.dislike = true;
                    this.firebaseService.updateLikes(key, l);
                    idpu = null;
                    reaccion = null;
                    idus = null;
                    console.log('fue un dislike');
                  } else if (reaccion == "dislike" && val[0].dislike == true) {
                    l.like = false;
                    l.dislike = false;
                    this.firebaseService.updateLikes(key, l);
                    idpu = null;
                    reaccion = null;
                    idus = null;
                    console.log('fue un dislike');
                  }

                });
                x++;
              }
            } catch (e) {

            }
          }
          if (bandera == false) {
            for (var x = 0; x < result.length; x++) {
              if ((values[x].idpublication != idpu) && (values[x].iduser == idus)) {
                console.log("un registro nuev0");
                if (reaccion == 'like') {
                  l.like = true;
                  l.dislike = false;
                  this.firebaseService.getNewLikes(l);
                  idus = null;
                  idpu = null;
                  reaccion = null;
                  break;

                }
                else if (reaccion == 'dislike') {
                  l.like = false;
                  l.dislike = true;
                  this.firebaseService.getNewLikes(l);
                  idus = null;
                  reaccion = null;
                  idpu = null;
                  break;
                }
                x++;


              }

            }
          }
        }
      }


    });

    const ngZone = this.injector.get(NgZone);
    ngZone.run(() => {
      //   this.newsArray = null;
      this.router.navigate(['/news']);
    });
  }

  recordNews(records) {
    console.log(records);
  }

  openCreateForm() {
    if(this.create==false){
      this.create = true;

    }else{
      this.create = false;

    }
  }

  createNew(newsForm, value) {
    var creationDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    var extradata = {
      admin: "Angel R.",
      creationDate: creationDate,
      likes: 0,
      notlikes: 0,

    };
    if (this.url != null) {
      console.log(this.url);
      var imgRef = '/img/' + this.imageRef;
      this.afStorage.upload(imgRef, this.targetFile);
      console.log("imagen guardada?");

      this.firebaseService.createNews(value, imgRef, extradata)
        .then(
          res => {
            console.log(res);
            this.getNews();
            // this.router.navigate(['/home']);
          });
    }
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
