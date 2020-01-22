import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { Observable, of } from 'rxjs';
import { Injectable, Injector, NgZone } from '@angular/core';
import { User } from '../models/user.model'; // optional
import { Role } from '../models/role'; // optional
import { Plant } from '../models/plant';
import { Departament } from '../models/departament';
import { NewUser } from '../models/newUser.model'; // optional
import { Router } from '@angular/router';






@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public roles: Role[];
  public plants: Plant[];
  public departments: Departament[];
  public user: User;
  public newUser: NewUser;
  userinfo$: Observable<User>;

  constructor(private router: Router, private injector: Injector, public auth: AuthService, public db: FirebaseService) { }

  ngOnInit() {
    this.getNewUserData();
    this.getDepartments();
    this.getPlants();
    this.getRoles();

  }
  googleSignUp(){
    this.auth.googleSignUp();
    this.getNewUserData();
  }

  getNewUserData():void{
    this.auth.getNewUserData().subscribe((result)=>{
      this.newUser = result;
      console.log(this.newUser);

    });
  }

  registerNewUser(form, data){
    // console.log(data.role);
    var newuser = {
      id: this.newUser.id,
      fullName: this.newUser.fullName,
      email: this.newUser.email,
      birthDate: data.birthdate,
      employeeNumber: data.employeeNumber,
      idDepartment: data.department,
      idPlant: data.plant,
      idRole: "user",
      image: this.newUser.image,
      authorized: false

    };
    console.log(newuser);
    this.auth.registerNewUser(newuser).then(result=>{
      console.log(result);
      this.router.navigate(['/login']);
    })
  }
  getDepartments(){
    this.db.getDepartments().snapshotChanges().subscribe((response) => {
      this.departments = [];
      response.forEach( element => {
        // this.id = element.payload.key;
        // console.log(this.id);
        let data = element.payload.toJSON();
        data['$key'] = element.key;
        this.departments.push(data as Departament);
      })
    });
  }
  getPlants(){
    this.db.getPlantss().snapshotChanges().subscribe((response) => {
      this.plants = [];
      response.forEach( element => {
        // this.id = element.payload.key;
        // console.log(this.id);
        let data = element.payload.toJSON();
        data['$key'] = element.key;
        this.plants.push(data as Plant);
      })
    });
  }
  getRoles(){
    this.db.getRoless().snapshotChanges().subscribe((response) => {
      this.roles = [];
      response.forEach( element => {
        // this.id = element.payload.key;
        // console.log(this.id);
        let data = element.payload.toJSON();
        data['$key'] = element.key;
        this.roles.push(data as Role);
      })
    });
  }

}
