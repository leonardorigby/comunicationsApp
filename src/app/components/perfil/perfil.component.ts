import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import Swal from 'sweetalert2';
import { AuthService } from './../../services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  public user: User;
  public loginuser: boolean = true;
  users: any;
  usersTmp: any;


  constructor( 
    public auth: AuthService, 
    private router: Router,
    private fcm: AngularFireMessaging,
    public db: FirebaseService){
  }

  ngOnInit() {
    console.log(this.auth)

  }

  public activarNotificaciones(){

    return this.fcm.requestPermission.subscribe( () =>{

      console.log('Se pidio el permiso');
      new Notification('Bienvenido a Sanmina news',{ body : 'Ahora estaras enterado de cualquier noticia'})

    }, err => console.log('Error al pedir permiso de las notificaciones o las cancelo',err) );

  }
     
 
}
