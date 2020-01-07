import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Role } from '../models/role';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  rolesList: Role[];
  id: string;
  
  constructor(public firebaseService: FirebaseService, public afStorage: AngularFireStorage) { }

  ngOnInit() {
    this.firebaseService.getRoles();
    this.resetForm();
    this.firebaseService.getRoles().snapshotChanges().subscribe(item => {
      this.rolesList = [];
      item.forEach(element => {
        this.id = element.payload.key;
        console.log(this.id);
        let data = element.payload.toJSON();
        console.log(data);
        data['$key'] = element.key;
        this.rolesList.push(data as Role);
      })
    })
  
  }

  onSubmit(roleForm: NgForm) {

    if (roleForm.value.$key == null)
      this.firebaseService.createRole(roleForm.value)
    else
      this.firebaseService.updateRole(roleForm.value);
    this.resetForm(roleForm);
  }
  resetForm(roleForm?: NgForm) {
    if (roleForm != null) {
      roleForm.reset();
      this.firebaseService.selectRole = new Role();
    }
  }
  deleteRole($key: string) {
    if (confirm('quieres eliminarlo')) {
      this.firebaseService.deleteRole($key);
    }
  }
  onEditRole(role: Role) {
    this.firebaseService.selectRole = Object.assign({}, role);
  }
}
