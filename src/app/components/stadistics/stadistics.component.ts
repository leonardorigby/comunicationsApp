import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthService } from 'src/app/services/auth.service';
// import { ExportToCsv } from 'export-to-csv';
//  import * as CSV from 'csv-string';
import  { ExportToCSV } from "@molteni/export-csv";
import Swal from 'sweetalert2'



@Component({
  selector: 'app-stadistics',
  templateUrl: './stadistics.component.html',
  styleUrls: ['./stadistics.component.scss']
})
export class StadisticsComponent implements OnInit {

  constructor(public firebaseService: FirebaseService, public afStorage: AngularFireStorage, public auth: AuthService) { }

  publications = new Array();
  reactions: any;
  change: any;
  january: any;
  february: any;
  march: any;
  april: any;
  may: any;
  june: any;
  july: any;
  august: any;
  september: any;
  october: any;
  november: any;
  december: any;
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Likes' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Dislikes' }
  ];

  ngOnInit() {
   
    this.january = 0;
    this.february = 0;
    this.march = 0;
    this.april = 0;
    this.may = 0;
    this.june = 0;
    this.july = 0;
    this.august = 0;
    this.september = 0;
    this.october = 0;
    this.november = 0;
    this.december = 0;
    this.change = "Stadistics";
    this.reactions = "all";
    this.firebaseService.getNews().subscribe((result) => {
      this.publications = new Array();

      result.forEach((Data: any) => {
        // console.log(Data.payload.doc.data());
        var aux = Data.payload.doc.data();
        aux.dislike.forEach((data: any) => {
          data.like = false;
        });
        aux.like.forEach((data: any) => {
          data.like = true;
        });
        aux.allLikes = aux.dislike.concat(aux.like);
        aux.allLikes.sort();
        this.publications.push(aux)
      });
      var arraux = this.publications.sort((unaMascota, otraMascota) => unaMascota.title.localeCompare(otraMascota.title));
      this.publications = arraux;
      //  this.getCharts();


      // console.log(this.publications);
        // setTimeout(this.getCharts, 80000);


    })
    
  }


  exportCSV(data) {
  //  const arr = this.CSV.parse(data);
   console.log(data);
   var exporter = new ExportToCSV();
exporter.exportColumnsToCSV(this.publications, "Conteo De Interacciones",["allLikes"]);
    // const options = {
    //   filename: 'Conteo De Interacciones',
    //   fieldSeparator: ',',
    //   quoteStrings: '"',
    //   decimalSeparator: '.',
    //   showLabels: true,
    //   showTitle: true,
    //   title: 'Likes ',
    //   useTextFile: false,
    //   useBom: true,
    //   useKeysAsHeaders: true,
    // };
    // const csvExporter = new ExportToCsv(options);
    // csvExporter.generateCsv(data);
  }

  getCharts() {
    setTimeout(function(){
    this.publications.forEach(element => {
      var likes = element.allLikes;
      var arrayLikes = new Array();
        var arrayDisLikes = new Array();
      likes.forEach(fechas => {
        
        if (fechas.like = false) {
          var op = fechas.date.slice(5, -13);
          switch (op) {
            case '01': arrayDisLikes.push('january'); break;
            case '02': arrayDisLikes.push('february'); break;
            case '03': arrayDisLikes.push('march'); break;
            case '04': arrayDisLikes.push('april'); break;
            case '05': arrayDisLikes.push('may'); break;
            case '06': arrayDisLikes.push('june'); break;
            case '07': arrayDisLikes.push('july'); break;
            case '08': arrayDisLikes.push('august'); break;
            case '09': arrayDisLikes.push('september'); break;
            case '10': arrayDisLikes.push('october'); break;
            case '11': arrayDisLikes.push('november'); break;
            case '12': arrayDisLikes.push('december'); break;

          }

        } else if (fechas.like = true) {
          var op = fechas.date.slice(5, -13);
          switch (op) {
            case '01': arrayLikes.push('january'); break;
            case '02': arrayLikes.push('february'); break;
            case '03': arrayLikes.push('march'); break;
            case '04': arrayLikes.push('april'); break;
            case '05': arrayLikes.push('may'); break;
            case '06': arrayLikes.push('june'); break;
            case '07': arrayLikes.push('july'); break;
            case '08': arrayLikes.push('august'); break;
            case '09': arrayLikes.push('september'); break;
            case '10': arrayLikes.push('october'); break;
            case '11': arrayLikes.push('november'); break;
            case '12': arrayLikes.push('december'); break;

          }
        }
      });
      // aqui se supone acabo la publicacion
//       var repetidos = {};

// arrayLikes.forEach(function(numero){
//   repetidos[numero] = (repetidos[numero] || 0) + 1;
// });
// console.log(repetidos)
// var repetidos1 = {};

// arrayDisLikes.forEach(function(numero){
//   repetidos1[numero] = (repetidos1[numero] || 0) + 1;
// });
// console.log(repetidos1)
    });
    console.log(
      this.january,
      this.february,
      this.march,
      this.april,
      this.may,
      this.june,
      this.july,
      this.august,
      this.september,
      this.october,
      this.november,
      this.december)
    // switch()
  },500);
}






  changeTable() {
    if (this.change == 'Stadistics') {
      this.change = 'Table';
    } else if (this.change == 'Table') {
      this.change = 'Stadistics';

    }
  }
  filterOption(op) {
    switch (op) {

      case 'all': this.reactions = "all";

        break;
      case 'like': this.reactions = "like";

        break;
      case 'dislike': this.reactions = "dislike";

        break;
    }

  }
  delete(key,name){
    Swal.fire({
      title: 'Seguro quieres eliminar la publicacin con el titulo',
      text: name+"",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, Cancelar!',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.firebaseService.deleteNew(key);
        Swal.fire(
          'Eliminaste la publicación!',
          'publicación eliminda permanentente',
          'success'
        )
      }
    })
    // this.firebaseService.deleteNew(key);
    // console.log("se supone que elimino");
  }
  update(data){
    console.log("se supone que actualizo",data);
    document.getElementById('contenedor1').innerHTML="<button type='button'  data-toggle='modal' data-target='#"+data.key+"'></button>";
    document.getElementById('contenedor1').innerHTML="<div class='modal fade' id='"+data.key+"' data-backdrop='static' data-keyboard='false' tabindex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='staticBackdropLabel'>Modal title</h5><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><div class='modal-body'></div><div class='modal-footer'><button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancelar</button><button type='button' class='btn btn-primary'>Editar</button></div></div></div></div>";
    document.getElementById(data.key).click();

  }
  updateAll(key,data){
    // this.firebaseService.updateNew(key,data);
    console.log("se supone que actualizocon datos");

  }
}
