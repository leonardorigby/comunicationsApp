import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public plants;

  constructor(public auth: AuthService, public db: FirebaseService) { }

  ngOnInit() {

  }
  googleSignUp(){
    this.auth.googleSignUp().subscribe((result)=>{
      console.log(result);
    });
  }
  getPlants(){
    this.plants = this.db.getPlants();
    // this.db.getPlants().subscribe((response) => {
    //   console.log(response);
    //   this.plants = response;
    // });
  }

}
