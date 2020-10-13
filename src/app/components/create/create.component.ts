
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit} from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';

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
import { Departamento, NotificacionesComponent, Planta } from '../notificaciones/notificaciones.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

declare var $: any;


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

  
  public departamentos : Departamento[] = [];
  public plantas: Planta[] = [];

  

  public formaNoticia: FormGroup;



  constructor(private router: Router,
    public firebaseService: FirebaseService,
    public afStorage: AngularFireStorage,
    public auth: AuthService
    ) { }


  ngOnInit() {

   

    this.cargarNoticiaForm();
    this.cargarZonas();



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

  private cargarZonas(){


    this.firebaseService.getDepartaments().snapshotChanges().subscribe( departamentos =>{

     
      departamentos.forEach( departamento =>{

     
      const  { name }  =  departamento.payload.toJSON() as any ;

      this.departamentos.push( { $key : departamento.key , name , check: false})


      });

     console.log('Los departamentos');
    
     console.table(this.departamentos);
     
      
    });

    this.firebaseService.getPlants().snapshotChanges().subscribe( plantas =>{

   

     plantas.forEach( planta =>{

      const { name } = planta.payload.toJSON() as any;

      this.plantas.push({ $key : planta.key , name , check: false})

     });

   

    
     console.log('Las plantas',);
     console.table(  this.plantas );

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

  private cargarNoticiaForm (){

    this.formaNoticia = new FormGroup({

      titulo: new FormControl(null, Validators.required ),

      urlImg : new FormControl(null, Validators.required),

      categoria: new FormControl(null, Validators.required ),

      tituloNotificacion: new FormControl(null, Validators.required ),

      cuerpo: new FormControl(null, Validators.required )



    });


  };

  public async crearNoticia(){

   await this.firebaseService.getNew('9ZQdQplqPJ2fAVWop0CF').toPromise()
    .then( noticia =>{

      console.log('Asi trae a la noticia', noticia);

    })
    .catch(err => console.log('Error al obtener una noticias por id',err) );


    console.log('Valores del formulario', this.formaNoticia );

    

  }

  createNew(newsForm, value) {
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
  
    // if (this.url != null ) {
    //   var imgRef = '/img/' + this.imageRef;
    //   this.afStorage.upload(imgRef, this.targetFile).then(r => {
    //     this.afStorage.ref(imgRef).getDownloadURL().subscribe(downloadURL => {
    //       this.firebaseService.createNews(value, downloadURL, extradata)
    //         .then(
    //           res => {
    //             console.log(res);
    //           });

    //     });
    //     console.log("imagen guardada?");
    //   });
    // }else{

      this.firebaseService.createNews(value, "", extradata)
            .then(
              res => {
                let aux=[];
                aux.push(res);
                 var key=aux[0]._key.path.segments[1];
                 var  notif=""; 
                 this.firebaseService.getNew(key).subscribe((r:any)=>{
                  var data=r.payload.data();
                  if(data.image==undefined){
                  data.image="";
                  }
                  notif = <any>{
                  admin: data.admin,
                  key: key,
                  description: data.description,
                  dislike: data.dislike,
                  like: data.like,
                  endDate: data.endDate,
                  categoria: data.categoria,
                  urlimg: data.urlimg,
                  startDate: data.startDate,
                  title: data.title,
                  encuesta:data.encuesta,
                };

               return this.firebaseService.updateNew(key, notif);
              
              }) ;

              })
              .then( () =>{
                console.log('Se guardo la noticia');

               
              })
              
              .catch(err => console.log('Error al crear la noticia', err) );
    // }
    newsForm.reset();
    // this.newsArray = new Array;
    this.router.navigate(['/home']);

  }
  getUrl(){
  this.url=$("#urlimg").val().slice(32, -17);
  console.log(this.url);
}







 









}
