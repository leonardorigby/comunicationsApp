import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Plant } from '../models/plant'
import { NgForm } from '@angular/forms';
import { Role } from '../models/role';
import { element } from 'protractor';
import { iif } from 'rxjs';

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
  rolesList: Role[];


  constructor(public firebaseService: FirebaseService, public afStorage: AngularFireStorage) { }
  ngOnInit() {
    //this.getAllPlants();
    this.firebaseService.getRoles();
    this.resetForm();
    this.firebaseService.getRoles().snapshotChanges().subscribe( item => {
      this.rolesList = [];
      item.forEach( element => {
        this.id = element.payload.key;
        console.log(this.id);
        let data = element.payload.toJSON();
        console.log(data);
        data['$key'] = element.key;
        this.rolesList.push(data as Role);
      })
    })
  }
  openCreateForm() {
    if(this.create == true){
      this.create = false;
    }else{
      this.create = true;
    }
    this.create;
      console.log(this.create);
    
  }
  getAllPlants() {
    this.firebaseService.getPlants().subscribe((result) => {
      console.log(result);
      this.plantArray = [];
      result.forEach((plantData: any) => {
        this.id = plantData.payload.doc.id;
        console.log(this.id);
        var data = plantData.payload.doc.data();
        console.log(data);
        this.plantArray.push({
          name: data.name,
          number: data.number
        })
      });


    });

  }

  createPlant(plantForm){
    this.firebaseService.createPlant(plantForm.value).then(result => {
      console.log(result);
    });
  
 }


  deletePlanta(result) {
    
   this.firebaseService.deletePlant(result);
  }

  updatePlant(plantForm) {
    this.firebaseService.updatePlant(this.id, plantForm).then(
      data => {
        console.log(data);
      });
  }

  onSubmit(roleForm: NgForm){

    if(roleForm.value.$key == null)
    this.firebaseService.createRole(roleForm.value)
    else
    this.firebaseService.updateRole(roleForm.value);
    this.resetForm(roleForm);
  }
  resetForm(roleForm?: NgForm){
    if(roleForm != null){
      roleForm.reset();
      this.firebaseService.selectRole = new Role();
    }
  }
  deleteRole($key: string){
    if(confirm('quieres eliminarlo')){
      this.firebaseService.deleteRole($key);
    }
  }
  onEditRole(role:Role){
    this.firebaseService.selectRole = Object.assign({},role);
  }


}
