import { Component, OnInit } from '@angular/core';
import { Icons } from '../models/icons';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent implements OnInit {

  iconsList: Icons[];
  id: string;


  constructor(public firebaseService: FirebaseService, public afStorage: AngularFireStorage) { }

  ngOnInit() {
    this.firebaseService.getAllIcons();
    this.resetForm();
    this.firebaseService.getAllIcons().snapshotChanges().subscribe(item => {
      this.iconsList = [];
      item.forEach(element => {
        this.id = element.payload.key;
        console.log(this.id);
        let data = element.payload.toJSON();
        console.log(data);
        data['$key'] = element.key;
        this.iconsList.push(data as Icons);
      })
    })
  }

  onSubmit(IconsForm: NgForm) {

    if (IconsForm.value.$key == null)
      this.firebaseService.createIcons(IconsForm.value)
    else
      this.firebaseService.updateIcons(IconsForm.value);
    this.resetForm(IconsForm);
  }
  resetForm(IconsForm?: NgForm) {
    if (IconsForm != null) {
      IconsForm.reset();
      this.firebaseService.selectIcons = new Icons();
    }
  }
  deleteIcons($key: string) {
    if (confirm('quieres eliminarlo')) {
      this.firebaseService.deleteIcons($key);
    }
  }
  onEditIcons(Icons: Icons) {
    this.firebaseService.selectIcons = Object.assign({}, Icons);
  }



}