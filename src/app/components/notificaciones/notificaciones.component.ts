import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { environment} from 'src/environments/environment';

import { User } from '../models/user.model';



@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent implements OnInit {


  public departamentos : Departamento[] = [];
  public plantas: Planta[] = [];

  

  public formaNotificaion: FormGroup;

  public nombreUsuario: string = '';

  public encontrado: boolean ;

  public usuarioToken:string ='';


  

  constructor( 
    private httpService: HttpClient,
    public firebaseService: FirebaseService
    ) { 
    
      


  }



  ngOnInit() {

    this.cargarForms();
    this.cargarZonas();

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

 

  private cargarZonas(){


    this.firebaseService.getDepartaments().snapshotChanges().subscribe( departamentos =>{

      departamentos.forEach( departamento =>{

      const  { name }  =  departamento.payload.toJSON() as any ;

      this.departamentos.push( { $key : departamento.key , name , check: false});
      });

     console.log( this.departamentos );
     
      
    });

    this.firebaseService.getPlants().snapshotChanges().subscribe( plantas =>{

     plantas.forEach( planta =>{

      const { name } = planta.payload.toJSON() as any;

      this.plantas.push({ $key : planta.key , name , check: false});
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
      this.formaNotificaion.reset({
        titulo:'',
        cuerpo:''
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


