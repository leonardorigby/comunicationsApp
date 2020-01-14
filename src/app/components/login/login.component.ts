import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../models/user.model'; // optional
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: User;


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
        console.log("lleno");
        if(this.user.authorized==true){
          this.router.navigate(['/news']);
        }else{
          this.auth.signOut();
        }
      }else{
        console.log("vacio");
      }
    });
  }

}
