import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model'; // optional
import { Role } from '../models/role'; // optional
import { Plant } from '../models/plant';
import { Departament } from '../models/departament';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: any;
  usersTmp: any;
  public roles: Role[];
  searchValue: any;

  constructor(private router: Router, public auth: AuthService, public db: FirebaseService) { }

  ngOnInit() {
    this.getUsers();
    this.getRoles();

  }

  searchUsers() {
    var vm= this ;
    vm.users = [];
    const name = this.searchValue;
    console.log(name)
    this.usersTmp.findIndex(function(post, index) {
	     if(post.fullName.startsWith(name)){
         // console.log(post);
         vm.users.push(post);
         console.log(vm.users);

      }
    });

   }

getUsers(){
  this.db.getUsers().subscribe((result)=>{
    this.users = [];
    result.forEach((usersData: any)=> {
      this.users.push(usersData.payload.doc.data());

    });
    this.usersTmp = this.users;
    console.log(this.usersTmp);

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

  deleteUser(key, name){
    Swal.fire({
  title: '¿Estas seguro de eliminar al usuario: '+name+"?",
  text: "Se eliminara permenente!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si, eliminar'
}).then((result) => {
  if (result.value) {
    this.db.deleteUser(key).then(result=>{
      Swal.fire(
        'Se elimino al usuario: '+ name,
        'Eliminado exitosamente!',
        'success'
      )
      // this.getUsers();
    });
  }
})

}
changeRol(user, rol){
  this.db.updateUserRole(user, rol).then((response) => {
    this.getUsers();
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
