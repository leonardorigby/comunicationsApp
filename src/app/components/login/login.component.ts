import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../models/user.model'; // optional
import { Router } from '@angular/router';
import Swal from 'sweetalert2'



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: User;
  public loginuser: boolean = true;


  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.getUserData();
  }

  googleSignin(){
    this.auth.googleSignin();
    this.getUserData();
  }
  getUserData():void{
    this.auth.getUserData().subscribe((result)=>{
      this.user = result;
      console.log(this.user);
        if(this.user){
        console.log("user");
        if(this.user.authorized==true){
          this.loginuser = true;
          console.log("authorized");
          this.router.navigate(['/news']);
        }else if(this.user.authorized==false){
          this.loginuser = true;
          console.log("not authorized");

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡Usuarios sin permisos para acceder!',
            footer: '<a href>¡Acudir a RH para solicitar acceso!</a>'
          })
          this.router.navigate(['/login'])
        }
        this.loginuser = true;
      }else{
        console.log("no user");
        this.loginuser = false;
        // Swal.fire({
        //   icon: 'error',
        //   title: 'Oops...',
        //   text: '¡Usuario no registrado!',
        // })
        // this.router.navigate(['/register']);
      }
    });
  }

}
