import { Component, OnInit } from '@angular/core';
import { GeneralService } from'./services/general.service';
import * as $ from 'jquery';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';

import { AngularFireMessaging } from '@angular/fire/messaging';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  title = 'Comunications App';
  public changetheme: boolean = true;
  // url: string;

  constructor(route: ActivatedRoute,
     private router: Router,
      private generalservice: GeneralService,
       public auth: AuthService,
       private afMessaging: AngularFireMessaging,
       private http: HttpClient,
       private fcm: AngularFireMessaging){
    // console.log(this.route);

  }

  public pedirPermisoNotificaciones(){

    
    this.afMessaging.getToken.toPromise()
    
    .then( token =>{

      if( token ){
        
        console.log('token fresco', token);

        const headers = new HttpHeaders({
          'Authorization': 'key=AAAAkYtejHk:APA91bEjqyrVYjgLiJ-omeOtXNwslB6OQRwDfIbvZh7ESDBSAax_RwkOHaCj-JyA1ai6LROhuSi085GUhnP9xMRyLq4Dw5rJeQRbQpu6vgkIdoKCyQoGrKRDCy-U4bfU5VbUvOCiCFOF'
        });


        this.http.post(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/all`,{}, {headers})
        .toPromise()
        .then( () =>{

          console.log('Se guardo el token para el topic all');
        })
        .catch(err => {
          console.log('Error al guardar token para el topic all',err);
        })

      }else{

        return this.afMessaging.requestPermission.toPromise();

      }


    } )
    .then( () =>{
      console.log('Se pidio el permiso');
    })
    
    .catch( err => console.log('Error al usar las notificaciones', err) );

  }

  ngOnInit(){


    //Para que la notificacion se muestre aunque este abierta la app
    this.fcm.messages.subscribe( (mensaje:any) =>{

      console.log('Llega ', mensaje);

      new Notification(
         mensaje.notification.title,
          { body :  mensaje.notification.body } 
         );

     
    }, err => console.log(err) );


    if( ! localStorage.getItem('token') ){

      this.afMessaging.getToken.toPromise()
    
      .then( token =>{
  
        if( token ){

          localStorage.setItem('token', token);
          
          console.log('Token del usuario ', token );
  
        }else{
  
          return this.afMessaging.requestPermission.toPromise();
  
        }
  
  
      } )
      .then( () =>{
        console.log('Se pidio el permiso');
      })
      
      .catch( err => console.log('Error al usar las notificaciones', err) );

    }else{

      console.log('Ya hay un token guardado', localStorage.getItem('token'));
    }

    



    $(".page-wrapper").removeClass("toggled");
    // this.testService();
    // this.testOneSignal();
    // Fetch the computer's mac address
// require('getmac').getMac(function(err, macAddress){
//     if (err)  throw err
//     console.log(macAddress)
// })
  }

  openSideBar(){
    $(".page-wrapper").addClass("toggled");
  }
  closeSideBar(){
    $(".page-wrapper").removeClass("toggled");
  }
  changeColor(){
    this.changetheme = !this.changetheme;

    if(this.changetheme===true){

      this.generalservice.toggleDark();

    }else if(this.changetheme===false){

      this.generalservice.toggleLight();
    }
  }

  testService(){
    this.generalservice.testService().subscribe(
     response => {
        // console.log(response);
     },
     err => {
       console.log(err);
     });
  }
  testOneSignal(){
    this.generalservice.testOneSignal().subscribe(
     response => {
        // console.log(response);
     },
     err => {
       console.log(err);
     });
  }


}
