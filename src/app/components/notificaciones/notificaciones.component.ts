import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { environment} from 'src/environments/environment';
import { Departament } from '../models/departament';
import { Plant } from '../models/plant';

import $ from 'jquery';



@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent implements OnInit {


  public departamentos : Departamento[] = [];
  public plantas: Planta[] = [];

  

  public formaNotificaion: FormGroup;

  public usuarioToken:string ='';


  

  constructor( 
    private httpService: HttpClient,
    private fcm: AngularFireMessaging,
    public firebaseService: FirebaseService,
    private vista: ApplicationRef
    ) { 
    
      


  }



  ngOnInit() {

    this.cargarForms();
    this.cargarZonas();

  }

 

  private cargarZonas(){


    this.firebaseService.getDepartaments().snapshotChanges().subscribe( departamentos =>{

     
      departamentos.forEach( departamento =>{

     
      const  { name }  =  departamento.payload.toJSON() as any ;

      this.departamentos.push( { $key : departamento.key , name , check: false})


      });

     console.log( this.departamentos );
     
      
    });

    this.firebaseService.getPlants().snapshotChanges().subscribe( plantas =>{

   

     plantas.forEach( planta =>{

      const { name } = planta.payload.toJSON() as any;

      this.plantas.push({ $key : planta.key , name , check: false})

     });

   

    
     console.log('Las plantas', this.plantas);

    });



  }

  public enviarATodos(){

    const headers = new HttpHeaders({
      'Authorization': environment.fcmKey
    });

    const notificacionBody = {
      notification:{
        title: this.formaNotificaion.value.titulo,
        body: this.formaNotificaion.value.cuerpo
      },
      to:'/topics/all'
    };

   return this.httpService.post('https://fcm.googleapis.com/fcm/send', notificacionBody ,{ headers })
    .toPromise()
    .then( resp =>{
      console.log('Talves se envio', resp);

    })
    .catch(err => console.log('Error al enviar notificacion para uno', err) );
    

  }

  public enviarAUsuario(){

    const headers = new HttpHeaders({
      'Authorization': environment.fcmKey
    });

    const notificacionBody = {
      notification:{
        title: this.formaNotificaion.value.titulo,
        body: this.formaNotificaion.value.cuerpo
      },
      to: this.usuarioToken
    };

   return this.httpService.post('https://fcm.googleapis.com/fcm/send', notificacionBody ,{ headers })
    .toPromise()
    .then( resp =>{
      console.log('Talves se envio', resp);
      this.formaNotificaion.reset({
        titulo:'',
        cuerpo:''
      });

    })
    .catch(err => console.log('Error al enviar notificacion para uno', err) );


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
        title: this.formaNotificaion.value.titulo,
        body: this.formaNotificaion.value.cuerpo
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

      this.formaNotificaion.reset({
        titulo:'',
        cuerpo:''
      });

    })
    .catch(err => console.log('Error al enviar notificacion para uno', err) );

  }




  private cargarForms(){

    this.formaNotificaion = new FormGroup({

      titulo: new FormControl(null , Validators.required),

      cuerpo: new FormControl(null , Validators.required)
    });

  }

  




}

export interface Departamento{
  $key:string;
  name:string;
  check:boolean;
};

export interface Planta extends Departamento{};


