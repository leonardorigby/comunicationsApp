import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public firebaseService: FirebaseService) { }

  ngOnInit() {
    this.googleLogin();
  }

  googleLogin():any{
      this.firebaseService.getGoogleLoginService();
      // .subscribe(result => {
      //   console.log(result);
      // });
  }

}
