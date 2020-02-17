import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model'; // optional
import { Role } from '../models/role'; // optional
import { Plant } from '../models/plant';
import { Departament } from '../models/departament';
import { Router } from '@angular/router';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: any;

  constructor(private router: Router, public auth: AuthService, public db: FirebaseService) { }

  ngOnInit() {
    this.getUsers();
  }

getUsers(){
  this.db.getUsers().subscribe((result)=>{
    this.users = [];
    result.forEach((usersData: any)=> {
      this.users.push(usersData.payload.doc.data());

    });
  });
}
autorizedUser(info, key){
  // var employeesAPI = 'http://gdl1amwebw02.am.sanm.corp:8080/YildDefect/EmployeeInfo?employeeNumber=207002790';

  var user = {
    id: info.id,
    fullName: info.fullName,
    email: info.email,
    birthDate: info.birthDate,
    employeeNumber: info.employeeNumber,
    idDepartment: info.idDepartment,
    idPlant: info.idPlant,
    idRole: info.idRole,
    image: info.image,
    authorized: !info.authorized
  };
    this.db.updateUser(user, key).then(rsult=>{
      this.getUsers();
    });
  }

  deleteUser(key){
    this.db.deleteUser(key).then(rsult=>{
      this.getUsers();
    });
  }
}

// user{
//   id,
//   nombre,
//   apellido,
//   n. empleado,
//   departamento,
//   correo,
//   planta,
//   puesto,
//   mc address,
//   foto,
//   supervisor ne,
//   phone number,
// }
