import { Component, OnInit } from '@angular/core';
import { GeneralService } from'./services/general.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  title = 'Comunications App';
  public changetheme: boolean = true;

  constructor(private generalservice: GeneralService){

  }

  ngOnInit(){
    // this.testService();
    // this.testOneSignal();
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
        console.log(response);
     },
     err => {
       console.log(err);
     });
  }
  testOneSignal(){
    this.generalservice.testOneSignal().subscribe(
     response => {
        console.log(response);
     },
     err => {
       console.log(err);
     });
  }


}
