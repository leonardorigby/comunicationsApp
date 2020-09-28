import { Component, OnInit } from '@angular/core';
import { GeneralService } from'./services/general.service';
import * as $ from 'jquery';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';

import { AngularFireMessaging } from '@angular/fire/messaging';

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
       private afMessaging: AngularFireMessaging){
    // console.log(this.route);

  }

  ngOnInit(){




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
