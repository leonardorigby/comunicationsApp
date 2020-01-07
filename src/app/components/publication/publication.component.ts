import { Component, OnInit } from '@angular/core';
import { Publication } from '../models/publication';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';
import { Icons } from '../models/icons';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss']
})
export class PublicationComponent implements OnInit {

  publicationList: Publication[];
  id: string;
  iconsList: Icons[];

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
    this.firebaseService.getPublication();
    this.resetForm();
    this.firebaseService.getPublication().snapshotChanges().subscribe(item => {
      this.publicationList = [];
      item.forEach(element => {
        this.id = element.payload.key;
        console.log(this.id);
        let data = element.payload.toJSON();
        console.log(data);
        data['$key'] = element.key;
        this.publicationList.push(data as Publication);
      })
    })
  }

  onSubmit(publicationForm: NgForm) {

    if (publicationForm.value.$key == null)
      this.firebaseService.createPublication(publicationForm.value)
    else
      this.firebaseService.updatePublication(publicationForm.value);
    this.resetForm(publicationForm);
  }
  resetForm(publicationForm?: NgForm) {
    if (publicationForm != null) {
      publicationForm.reset();
      this.firebaseService.selectPublication = new Publication();
    }
  }
  deletePublication($key: string) {
    if (confirm('quieres eliminarlo')) {
      this.firebaseService.deletePublication($key);
    }
  }
  onEditPublication(publication: Publication) {
    this.firebaseService.selectPublication = Object.assign({}, publication);
  }

  

  selectIcono(icono){
    icono('#mySelect').selectpicker();
  }


}
