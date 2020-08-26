import { Component, OnInit } from '@angular/core';
import { GeneralService } from'./services/general.service';
import * as $ from 'jquery';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  title = 'Comunications App';
  public changetheme: boolean = true;
  // url: string;

  constructor(route: ActivatedRoute, private router: Router, private generalservice: GeneralService, public auth: AuthService){
    // console.log(this.route);

  }

  ngOnInit(){
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
