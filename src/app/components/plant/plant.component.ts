import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Plant } from '../models/plant'
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent implements OnInit {

  public plantArray: Plant[];
  id: string;
  create: boolean;
  show: boolean = true;
  position: any;
  plantList: Plant[];


  constructor(public firebaseService: FirebaseService, public afStorage: AngularFireStorage) { }
  ngOnInit() {
    //this.getAllPlants();
    this.firebaseService.getPlants();
    this.resetForm();
    this.firebaseService.getPlants().snapshotChanges().subscribe(item => {
      this.plantList = [];
      item.forEach(element => {
        this.id = element.payload.key;
        console.log(this.id);
        let data = element.payload.toJSON();
        console.log(data);
        data['$key'] = element.key;
        this.plantList.push(data as Plant);
      })
    })
  }
  onSubmit(plantForm: NgForm) {

    if (plantForm.value.$key == null)
      this.firebaseService.createPlant(plantForm.value)
    else
      this.firebaseService.updatePlant(plantForm.value);
    this.resetForm(plantForm);
  }
  resetForm(plantForm?: NgForm) {
    if (plantForm != null) {
      plantForm.reset();
      this.firebaseService.selectPlant = new Plant();
    }
  }
  deletePlant($key: string) {
    if (confirm('quieres eliminarlo')) {
      this.firebaseService.deletePlant($key);
    }
  }
  onEditPlant(plant: Plant) {
    this.firebaseService.selectPlant = Object.assign({}, plant);
  }
}
