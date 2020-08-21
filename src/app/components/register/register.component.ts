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
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms'








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

  registerForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,private router: Router, private injector: Injector, public auth: AuthService, public db: FirebaseService) {
  }

  ngOnInit() {
    this.getNewUserData();
    this.getDepartments();
    this.getPlants();
    this.getRoles();
    this.createForm();


  }
  createForm(){
    this.registerForm = this.formBuilder.group({
      employeeNumber: ['', Validators.required ],
      department: ['', Validators.required ],
      plant: ['', Validators.required ],
      birthdate: ['', Validators.required ]
   });
  }

  get f() {
    return this.registerForm.controls;
  }
  registerNewUser(form, data) {
    this.submitted = true;
    // stop here if form is invalid
       if (this.registerForm.invalid) {
       console.log(this.registerForm.invalid);
           return;
       }

        if(this.newUser.email.endsWith('@sanmina.com')){
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
            authorized: true
          };
          console.log(newuser);
          this.auth.registerNewUser(newuser).then(result => {
            console.log(result);
            this.router.navigate(['/login']);
          })
        }else{
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
          this.auth.registerNewUser(newuser).then(result => {
            console.log(result);
            this.router.navigate(['/login']);
          })
        }

  }


  googleSignUp(){
    this.auth.googleSignUp();
    this.getNewUserData();
  }

  getNewUserData():void {
      this.auth.getNewUserData().subscribe((result)=>{
        this.newUser = result;
        console.log(this.newUser);

      });
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
