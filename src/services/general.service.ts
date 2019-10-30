import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

// dark theme colors
export const darkTheme = {
  'container-color': '#31353D',
  'sidebar-color': '#31353D',
  'header-text-color': 'white',
  'body-text-color': 'rgb(201, 206, 217)',
  'footer-text-color': 'rgb(108, 117, 125)'

};
// ligth theme colors
export const lightTheme = {
  'container-color': 'white',
  'sidebar-color': 'rgb(244, 245, 249)',
  'header-text-color': 'black',
  'body-text-color': 'rgb(108, 117, 125)',
  'footer-text-color': 'rgb(201, 206, 217)'

};
@Injectable({
  providedIn: 'root'
})
export class GeneralService {

private userAPI = "https://randomuser.me/api/?results=1";
private oneSignalAPI = "https://onesignal.com/api/v1/notifications"

//   httpOptions = {
//   headers: new HttpHeaders({
//     "Content-Type": "application/json",
//   'Access-Control-Allow-Origin': '*'
//   })
// };

  constructor(private service: HttpClient) {
  }

  testService(){
    const info = this.service.get<any>(this.userAPI);
     return info
  }
  // "included_segments": ["Active Users"],
  // "excluded_segments": ["None"],
  // "include_player_ids":["b5fc8faa-a3da-4e08-ac90-09a9adf979bd"],
  // a2a980f0-fa96-40f7-a8d5-911d302978cd
  testOneSignal(){
    var body = {
      "app_id": "f097696f-ac5d-4f7b-bd1f-93460de86874",
      "include_player_ids":["a2a980f0-fa96-40f7-a8d5-911d302978cd"],
      "data": {"additional_message": "data to send goes here1"},
      "contents": {"en": "i am the best messages on differet languages!"}
    }
      return this.service.post(this.oneSignalAPI, body,{ headers: new HttpHeaders({"Content-Type": "application/json",'Authorization': 'OGZmNTI4ZDAtZTMyZC00Y2UxLThjOTQtNWY5ZGUxNzRmOWMw'})});
}
toggleDark() {
     console.log("darktheme");
    this.setTheme(darkTheme);
  }
  toggleLight() {
    console.log("ligththeme");

    this.setTheme(lightTheme);
  }
private setTheme(theme: {}) {
    Object.keys(theme).forEach(k =>
    document.documentElement.style.setProperty(`--${k}`, theme[k])
    );
  }
}
