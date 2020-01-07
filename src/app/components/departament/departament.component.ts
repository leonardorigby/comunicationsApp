import { Component, OnInit } from '@angular/core';
import { Departament } from '../models/departament';
import { NgForm } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-departament',
  templateUrl: './departament.component.html',
  styleUrls: ['./departament.component.scss']
})
export class DepartamentComponent implements OnInit {

  departamentList: Departament[];
  id: string;
  constructor(public firebaseService: FirebaseService, public afStorage: AngularFireStorage) { }

  ngOnInit() {
    this.firebaseService.getDepartaments();
    this.resetForm();
    this.firebaseService.getDepartaments().snapshotChanges().subscribe(item => {
      this.departamentList = [];
      item.forEach(element => {
        this.id = element.payload.key;
        console.log(this.id);
        let data = element.payload.toJSON();
        console.log(data);
        data['$key'] = element.key;
        this.departamentList.push(data as Departament);
      })
    })

  }

  onSubmit(departamenForm: NgForm) {

    if (departamenForm.value.$key == null)
      this.firebaseService.createDepartament(departamenForm.value)
    else
      this.firebaseService.updateDepartament(departamenForm.value);
    this.resetForm(departamenForm);
  }
  resetForm(departamenForm?: NgForm) {
    if (departamenForm != null) {
      departamenForm.reset();
      this.firebaseService.selectDepartament = new Departament();
    }
  }
  deleteDepartament($key: string) {
    if (confirm('quieres eliminarlo')) {
      this.firebaseService.deleteDepartament($key);
    }
  }
  onEditDepartament(departament: Departament) {
    this.firebaseService.selectDepartament = Object.assign({}, departament);
    console.log(Object.assign({}, departament))
  }

}
