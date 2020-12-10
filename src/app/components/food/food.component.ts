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
import { ThemeService } from 'ng2-charts';
import { GeneralService } from 'src/app/services/general.service';
import { format } from 'url';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit {
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
  event = '';
  uname: any;
  unumber: any;
  uimg: any;
  uss: any;
  arrayMetricos = new Array<Metrico>();
  arrayMetricosaux = new Array<any>();
  m: any;
  todas: boolean;
  like: boolean;
  dislike: boolean;
  user: Auxuser;
  view: any[] = [550, 450];
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Reacciones';
  showYAxisLabel = true;
  yAxisLabel = 'Personas';

  colorScheme = {
    domain: ['#A10A28', '#AAAAAA']
  };

  single = new Array<{
    name: '',
    value: 0
  }>();
  btn1: any;
  btn2: any;
  video: any;
  player: YT.Player;
  an: any;
  done: boolean;

  constructor(private general: GeneralService, public sanitizer: DomSanitizer, private router: Router, private injector: Injector, public firebaseService: FirebaseService, public afStorage: AngularFireStorage, public auth: AuthService) { }

  ngOnInit() {


    this.video = "https://www.youtube.com/embed/5Z2C0wy4bmg";
    this.arrayMetricos = new Array<Metrico>();
    this.arrayMetricosaux = new Array<any>();
    this.todas = true;
    this.like = false;
    this.dislike = false;
    this.getAllNews();
    this.auth.getUserData().subscribe(s => {
      this.uid = s.id;
      this.uname = s.fullName;
      this.unumber = s.employeeNumber;
      this.uimg = s.image;
      this.uss = {
        id: s.id,
        name: s.fullName,
        number: s.employeeNumber,
        img: s.image,
      }
    });
    if (screen.width < 1024) {
      this.view = [350, 350];
    } else if (screen.width < 1280) {
      this.view = [550, 450];
    } else {
      this.view = [550, 450];

    }
  }
  // public get currentTime(): number
  // public play(): void
  // public pause(): void
  // public cueVideoById(videoId: string, startSeconds?: number): void
  // public loadVideoById(videoId: string, startSeconds?: number): void
  savePlayer(player) {
    this.player = player;
    // console.log('player instance', player.getCurrentTime());
  }
  onStateChange(event) {

    // console.log(this.player.getVideoUrl());
    // this.player.set
    // setTimeout(, 600);
    // this.done = true;


  }
  stopVideo() {
    this.player.stopVideo();
  }
  pReacciones(value) {
    if (value == 'todas') {
      this.todas = true;
      this.like = false;
      this.dislike = false;
    } else if (value == 'like') {
      this.todas = false;
      this.like = true;
      this.dislike = false;
    } else if (value == 'dislike') {
      this.todas = false;
      this.like = false;
      this.dislike = true;
    }
  }
  onSelect(data): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  getMetricos() {
    this.firebaseService.getNews().subscribe(response => {
      for (var x = 0; x < response.length; x++) { this.arrayMetricosaux.push(response[x].payload.doc.data()); }

      this.arrayMetricosaux.forEach(not => {
        var u: any;

        this.firebaseService.getUsers().subscribe(result => {
          result.forEach(r => {
            var user: any;
            user = r.payload.doc.data();

            if (user.id == not.admin) {
              this.m = new Metrico;
              this.m.adminImg = user.image;
              this.m.adminName = user.fullName;
              this.m.endDate = not.endDate;
              this.m.startDate = not.startDate;
              this.m.title = not.title;
              if (not.dislike == undefined) {
                this.m.dislike = [];
                this.m.like = not.like;
              } else if (not.like == undefined) {
                this.m.dislike = not.dislike;
                this.m.like = [];
              } else {
                this.m.dislike = not.dislike;
                this.m.like = not.like;
              }
              let tmplike = new Array();
              let tmpdislike = new Array<Auxuser>();
              this.m.todas = new Array();
              for (var x = 0; x < this.m.like.length; x++) {
                this.user = new Auxuser;
                this.user.date = this.m.like[x].date;
                this.user.id = this.m.like[x].id;
                this.user.img = this.m.like[x].img;
                this.user.name = this.m.like[x].name;
                this.user.number = this.m.like[x].number
                this.user.like = true;
                this.m.todas.push(this.user);
              }
              for (var x = 0; x < this.m.dislike.length; x++) {
                this.user = new Auxuser;
                this.user.date = this.m.dislike[x].date;
                this.user.id = this.m.dislike[x].id;
                this.user.img = this.m.dislike[x].img;
                this.user.name = this.m.dislike[x].name;
                this.user.number = this.m.dislike[x].number
                this.user.like = false;
                this.m.todas.push(this.user);
              }
              this.arrayMetricos.push(this.m);

            }
          });
        });

      });


      // console.log(this.arrayMetricos);

    });



  }

  public crearUrlImg(id: string): string{

    return `https://res.cloudinary.com/dlor7n05z/image/upload/v1607017792/noticias/${id}`
  }

  getAllNews() {
    this.firebaseService.getNews().subscribe((result) => {
      this.newsArray = [];

      result.forEach((Data: any) => {
        var id = Data.payload.doc.id;
        this.idpublication = id;
        var aux = Data.payload.doc.data();
        console.log(aux)
        var now = new Date();
        var then = new Date(aux.startDate);
        // var diff = moment.duration(moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss")));
        var diff =(now.getTime() - then.getTime()) ;
        var hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);
        var mins = Math.floor(diff / (1000 * 60));
        diff -= mins * (1000 * 60);
        var seconds = Math.floor(diff / (1000 ));
        // var seconds
    
        aux.fechaPublicado={
          // dias:days,
          horas:hours,
          minutos:mins,
           segundos:seconds
        }
        // console.log(aux)
        if (aux.encuesta ) {

          //   console.log(aux);
          aux.single = [
            {
              "name": "Si",
              "value": aux.like.length
            },
            {
              "name": "No",
              "value": aux.dislike.length
            },

          ];
          //   console.log(this.single);
        }
        // aux.imgaux = aux.image;
        if (formatDate(new Date(), 'yyyy-MM-dd', 'en') == aux.endDate && formatDate(new Date(), 'hh:mm:ss', 'en') == '23:59:59') {
          this.firebaseService.createMetricos(aux);
          var storageRef = this.afStorage.ref(aux.image);//  bloque de eliminacion de imagen del storage
          storageRef.delete();// fin del bloque de eliminacion
          this.firebaseService.deleteNew(id);// Eliminacion de un elemento del la tabla con solo el id
          console.log('se elimino a ', aux);
        } else {
          aux.key = id;
          // 
          let tmplike = new Array();
          let tmpdislike = new Array();
          if (aux.like == undefined) {
            aux.like = new Array();
          } else {
            for (var x = 0; x < aux.like.length; x++) {
              tmplike.push(aux.like[x].id);
            }
          }
          if (aux.dislike == undefined) {
            aux.dislike = new Array();
          } else {
            for (var x = 0; x < aux.dislike.length; x++) {
              tmpdislike.push(aux.dislike[x].id);
            }

          }
          // 
          aux.auxlike = tmplike;
          aux.auxdislike = tmpdislike;
          aux.todas = new Array();
          for (var x = 0; x < aux.like.length; x++) {
            this.user = new Auxuser;
            this.user.date = aux.like[x].date;
            this.user.id = aux.like[x].id;
            this.user.img = aux.like[x].img;
            this.user.name = aux.like[x].name;
            this.user.number = aux.like[x].number
            this.user.like = true;
            aux.todas.push(this.user);
          }
          for (var x = 0; x < aux.dislike.length; x++) {
            this.user = new Auxuser;
            this.user.date = aux.dislike[x].date;
            this.user.id = aux.dislike[x].id;
            this.user.img = aux.dislike[x].img;
            this.user.name = aux.dislike[x].name;
            this.user.number = aux.dislike[x].number
            this.user.like = false;
            aux.todas.push(this.user);
          }
          aux.time = (moment(aux.endDate)).diff(moment(new Date()), 'days');
          this.newsArray.push(aux);

          var arraux = this.newsArray.sort(function (a, b) {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          });

          arraux.reverse();

          this.newsArray = arraux;

        }

      });

    });
  }

  getContador(idus, idpu, reaccion) {
  }
  getLikes(pub,reaccion) {
    if (reaccion == 'like') {
      if (pub.like.length >= 1) {
        let th = this;
        if (pub.like.some(person => person.id === this.uid) == true) {
          pub.like = pub.like.filter(function (e) { return e.id !== th.uid && e.name !== th.uname && e.number !== th.uname && e.img !== th.uimg });
          let notif = <any>{
            admin: pub.admin,
            key: pub.key,
            urlimg: pub.urlimg,
            description: pub.description,
            dislike: pub.dislike,
            like: pub.like,
            endDate: pub.endDate,
            startDate: pub.startDate,
            title: pub.title,
            encuesta: pub.encuesta,
            
          };
          th.firebaseService.updateNew(pub.key, notif);

        } else {
          if (pub.dislike.some(person => person.id === this.uid) == false) {
            pub.like.push({
              id: this.uid,
              name: this.uname,
              number: this.unumber,
              img: this.uimg,
              date: formatDate(new Date(), 'yyyy-MM-dd  HH:mm:ss', 'en')
            });
            let notif = <any>{
              admin: pub.admin,
              key: pub.key,
              description: pub.description,
              dislike: pub.dislike,
              urlimg: pub.urlimg,
              like: pub.like,
              endDate: pub.endDate,
              
              startDate: pub.startDate,
              title: pub.title,
              encuesta: pub.encuesta,
              
            };
            th.firebaseService.updateNew(pub.key, notif);
          } else if (pub.dislike.some(person => person.id === this.uid) == true) {
            pub.dislike = pub.dislike.filter(function (e) { return e.id !== th.uid && e.name !== th.uname && e.number !== th.uname && e.img !== th.uimg });
            pub.like.push({
              id: this.uid,
              name: this.uname,
              number: this.unumber,
              img: this.uimg,
              date: formatDate(new Date(), 'yyyy-MM-dd  HH:mm:ss', 'en')
            });
            let notif = <any>{
              admin: pub.admin,
              key: pub.key,
              description: pub.description,
              dislike: pub.dislike,
              like: pub.like,
              urlimg: pub.urlimg,
              endDate: pub.endDate,
              
              startDate: pub.startDate,
              title: pub.title,
              encuesta: pub.encuesta,
              
            };
            th.firebaseService.updateNew(pub.key, notif);
          }
        }
        // }
      } else {
        let th = this;
        // console.log('nuevo porque no hay nada');
        if (pub.dislike.some(person => person.id === this.uid) == false) {
          pub.like.push({
            id: this.uid,
            name: this.uname,
            number: this.unumber,
            img: this.uimg,
            date: formatDate(new Date(), 'yyyy-MM-dd  HH:mm:ss', 'en')
          });
          let notif = <any>{
            admin: pub.admin,
            key: pub.key,
            description: pub.description,
            dislike: pub.dislike,
            urlimg: pub.urlimg,
            like: pub.like,
            endDate: pub.endDate,    
            startDate: pub.startDate,
            title: pub.title,
            encuesta: pub.encuesta,
            
          };
          th.firebaseService.updateNew(pub.key, notif);
        } else if (pub.dislike.some(person => person.id === this.uid) == true) {
          pub.dislike = pub.dislike.filter(function (e) { return e.id !== th.uid && e.name !== th.uname && e.number !== th.uname && e.img !== th.uimg });
          pub.like.push({
            id: this.uid,
            name: this.uname,
            number: this.unumber,
            img: this.uimg,
            date: formatDate(new Date(), 'yyyy-MM-dd  HH:mm:ss', 'en')
          });
          let notif = <any>{
            admin: pub.admin,
            key: pub.key,
            description: pub.description,
            dislike: pub.dislike,
            like: pub.like,
            urlimg:pub.urlimg,
            endDate: pub.endDate,
            
            startDate: pub.startDate,
            title: pub.title,
            encuesta: pub.encuesta,
            
          };
          th.firebaseService.updateNew(pub.key, notif);
        }
      }
    } else if (reaccion == 'dislike') {
      let th = this;
      if (pub.dislike.length >= 1) {

        if (pub.dislike.some(person => person.id === this.uid) == true) {
          pub.dislike = pub.dislike.filter(function (e) { return e.id !== th.uid && e.name !== th.uname && e.number !== th.uname && e.img !== th.uimg });
          let notif = <any>{
            admin: pub.admin,
            key: pub.key,
            description: pub.description,
            dislike: pub.dislike,
            like: pub.like,
            endDate: pub.endDate,
            
            urlimg: pub.urlimg,
            startDate: pub.startDate,
            title: pub.title,
            encuesta: pub.encuesta,
            
          };
          th.firebaseService.updateNew(pub.key, notif);
          ////break;
        } else {
          if (pub.like.some(person => person.id === this.uid) == false) {
            pub.dislike.push({
              id: this.uid,
              name: this.uname,
              number: this.unumber,
              img: this.uimg,
              date: formatDate(new Date(), 'yyyy-MM-dd  HH:mm:ss', 'en')
            });
            let notif = <any>{
              admin: pub.admin,
              key: pub.key,
              description: pub.description,
              dislike: pub.dislike,
              like: pub.like,
              urlimg: pub.urlimg,
              endDate: pub.endDate,
              
              startDate: pub.startDate,
              title: pub.title,
              encuesta: pub.encuesta,
              
            };
            th.firebaseService.updateNew(pub.key, notif);
            //////break;
          } else if (pub.like.some(person => person.id === this.uid) == true) {
            let th = this;
            pub.like = pub.like.filter(function (e) { return e.id !== th.uid && e.name !== th.uname && e.number !== th.uname && e.img !== th.uimg });

            pub.dislike.push({
              id: this.uid,
              name: this.uname,
              number: this.unumber,
              img: this.uimg,
              date: formatDate(new Date(), 'yyyy-MM-dd  HH:mm:ss', 'en')
            });
            let notif = <any>{
              admin: pub.admin,
              key: pub.key,
              description: pub.description,
              dislike: pub.dislike,
              urlimg: pub.urlimg,
              like: pub.like,
              endDate: pub.endDate,
              
              startDate: pub.startDate,
              title: pub.title,
              encuesta: pub.encuesta,
              
            };
            th.firebaseService.updateNew(pub.key, notif);
            //////break;
          }

        }
        // x++;

      } else {
        let th = this;
        // console.log('nuevo porque no hay nada');
        if (pub.like.some(person => person.id === this.uid) == false) {
          pub.dislike.push({
            id: this.uid,
            name: this.uname,
            number: this.unumber,
            img: this.uimg,
            date: formatDate(new Date(), 'yyyy-MM-dd  HH:mm:ss', 'en')
          });
          let notif = <any>{
            admin: pub.admin,
            key: pub.key,
            dislike: pub.dislike,
            like: pub.like,
            urlimg: pub.urlimg,
            endDate: pub.endDate,
            
            startDate: pub.startDate,
            title: pub.title,
            encuesta: pub.encuesta,
            
          };
          th.firebaseService.updateNew(pub.key, notif);
        } else if (pub.like.some(person => person.id === this.uid) == true) {
          // console.log(th.uid);
          pub.like = pub.like.filter(function (e) { return e.id !== th.uid && e.name !== th.uname && e.number !== th.uname && e.img !== th.uimg });

          pub.dislike.push({
              id: this.uid,
            name: this.uname,
            number: this.unumber,
            img: this.uimg,
            date: formatDate(new Date(), 'yyyy-MM-dd  HH:mm:ss', 'en')
          });
          let notif = <any>{
            admin: pub.admin,
            key: pub.key,
            description: pub.description,
            dislike: pub.dislike,
            like: pub.like,
            urlimg: pub.urlimg,
            endDate: pub.endDate,
            
            startDate: pub.startDate,
            title: pub.title,
            encuesta: pub.encuesta,
            
          };
          th.firebaseService.updateNew(pub.key, notif);
        }
      }
    }
    localStorage.setItem("video", '' + this.player.getCurrentTime());
    // console.log(this.player.getCurrentTime()," lleva");

  }

  recordNews(records) {
    // console.log(records);
  }

  openCreateForm() {
    if (this.create == true) {
      this.create = false;

    } else {
      this.create = true;

    }
  }

  createNew(newsForm, value) {
    // console.log(value);
    // console.log(value, extradata);
    if (value.video == "") {
      value.video = undefined;
    }
    var creationDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    var extradata = {
      admin: {
        id: this.uid,
        image: this.uimg,
        name: this.uname,
        number: this.unumber
      },
      creationDate: creationDate
    };

    if (this.url != null) {

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




    } else {
      this.firebaseService.createNews(value, "", extradata)
        .then(
          res => {
            console.log(res);
          });
    }
    newsForm.reset();
    this.newsArray = new Array;
    this.router.navigate(['/home']);

  }

  getNews() {
    this.firebaseService.getNews()
      .subscribe(result => {
        // console.log(result);
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