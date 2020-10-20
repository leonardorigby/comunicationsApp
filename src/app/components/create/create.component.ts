
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit} from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';

import { formatDate } from '@angular/common';

import { Departamento, Planta } from '../notificaciones/notificaciones.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';



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
  private usuarioAutor: User;
  public formaNoticia: FormGroup;
  public tabSeleccionado :string ='todos';

  public encontrado: boolean;
  public nombreUsuario : string = '';
  public usuarioToken : string = '';


  constructor(private router: Router,
    public firebaseService: FirebaseService,
    public afStorage: AngularFireStorage,
    public auth: AuthService,
    private httpService: HttpClient
    ) { }


  ngOnInit() {

   

    this.cargarNoticiaForm();
    this.cargarZonas();

    this.auth.getUserData().subscribe( usuario => this.usuarioAutor = usuario );

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

      encuesta : new FormControl(false, Validators.required ),

      descripcion: new FormControl(null, Validators.required),

      endDate: new FormControl(null, Validators.required),

      tituloNotificacion: new FormControl(null, Validators.required ),

      cuerpo: new FormControl(null, Validators.required )



    });


  };

  public publicarNoticia(){

    console.log('Valores del formulario', this.formaNoticia.value );
   
    const admin = {
      id: this.usuarioAutor.id,
      image: this.usuarioAutor.image,
      name: this.usuarioAutor.fullName,
      number: this.usuarioAutor.employeeNumber
    };


    this.firebaseService.crearNoticia( this.formaNoticia.value, admin )
    .then(  () =>{

      console.log('Se creo la noticia');
      
      switch( this.tabSeleccionado ){

        case 'todos':

        this.enviarATodos();

        break;

        case 'usuario':

        this.enviarAUsuario();

        break;


        default:

        this.enviarATopics();
        
      }



    })
    .catch( err => console.log('Error en el proceso  de crear una noticia ', err) );
    

    console.log('Admin de la noticia', admin);

  }



  public enviarATodos(){

    const headers = new HttpHeaders({
      'Authorization': environment.fcmKey
    });

    const notificacionBody = {
      notification:{
        title: this.formaNoticia.value.tituloNotificacion,
        body: this.formaNoticia.value.cuerpo
      },
      to:'/topics/all'
    };

   return this.httpService.post('https://fcm.googleapis.com/fcm/send', notificacionBody ,{ headers })
    .toPromise()
    .then( resp =>{
      console.log('Talves se envio', resp);
      this.formaNoticia.reset({
        titulo :null,
        urlImg:null,
        categoria:null,
        encuesta:false,
        descripcion:null,
        endDate:null,
        tituloNotificacion:null,
        cuerpo:null
      });

    })
    .catch(err => console.log('Error al enviar notificacion para uno', err) );
    

  }

  public enviarAUsuario(){

    const headers = new HttpHeaders({
      'Authorization': environment.fcmKey
    });

    const notificacionBody = {
      notification:{
        title: this.formaNoticia.value.tituloNotificacion,
        body: this.formaNoticia.value.cuerpo
      },
      to: this.usuarioToken
    };

   return this.httpService.post('https://fcm.googleapis.com/fcm/send', notificacionBody ,{ headers })
    .toPromise()
    .then( resp =>{
      console.log('Talves se envio', resp);
      this.formaNoticia.reset({
        titulo :null,
        urlImg:null,
        categoria:null,
        encuesta:false,
        descripcion:null,
        endDate:null,
        tituloNotificacion:null,
        cuerpo:null
      });

    })
    .catch(err => console.log('Error al enviar notificacion para uno', err) );


  }

  public buscarUsuario(){
    
    this.firebaseService.getUserTokenByName(  this.nombreUsuario )
    .subscribe( resp =>{

      console.log('Asi llega la resp', resp);

     if( resp.length != 0 && (resp[0].payload.doc.data() as User).token ){

      console.log('Usuario encontrado con token', resp[0].payload.doc.data() as User );
      
      this.usuarioToken  = (resp[0].payload.doc.data() as User).token;

      this.encontrado = true;

     }else{

      console.log('No se encontro el usuario o no a configurado las actualizaciones');
      this.encontrado = false;

     }
     

    }, err => console.log(err) );

  }


  
  public enviarATopics(){
    

    const seleccionados = this.departamentos.filter( topic => topic.check == true );


    this.plantas.forEach( planta =>{
      if( planta.check ) seleccionados.push( {  $key: planta.$key , name: planta.name , check:true });
    });


    console.log('Los seleccionados en total son : ', seleccionados );

    let aux:string='';

      seleccionados.forEach( async(topic, index) => {
      
        aux += `'${topic.$key}' in topics ||`
        

        if( (index +1 ) == seleccionados.length &&  seleccionados.length <= 5 ){

          aux = aux.substring(0, aux.length-2);

          console.log('Se enviaran 5 o  menos', aux);
         this.enviarNotificacionATopics( aux );
          
          aux ='';

        }

        else if( (index +1 ) % 5 == 0  ){
  
          aux = aux.substring(0, aux.length-2);

          console.log('Se enviaran 5 a', aux);
       await this.enviarNotificacionATopics( aux );
        aux ='';
          
          
        }else if( seleccionados.length > 5 && (index +1 ) == seleccionados.length ){

          aux = aux.substring(0, aux.length-2);

          console.log('Se enviaran los que sobran', aux);
          this.enviarNotificacionATopics( aux );
          
          aux =''; 

        }
  
  
      
      } );


     

    // }
     
   
  }


  private enviarNotificacionATopics( condition:string ){

    const notificacionBody = {
      notification:{
        title: this.formaNoticia.value.tituloNotificacion,
        body: this.formaNoticia.value.cuerpo
      },
      condition
    };

    const headers = new HttpHeaders({
      'Authorization': environment.fcmKey
    });

   return this.httpService.post('https://fcm.googleapis.com/fcm/send', notificacionBody ,{ headers })
    .toPromise()
    .then( resp =>{
      console.log('Talves se envio', resp);

      this.formaNoticia.reset({
        titulo :null,
        urlImg:null,
        categoria:null,
        encuesta:false,
        descripcion:null,
        endDate:null,
        tituloNotificacion:null,
        cuerpo:null
      });

    })
    .catch(err => console.log('Error al enviar notificacion para uno', err) );

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
 // this.url=$("#urlimg").val().slice(32, -17);
  console.log(this.url);
}







 









}
