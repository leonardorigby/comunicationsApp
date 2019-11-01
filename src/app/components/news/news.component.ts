import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  create: boolean = false;
  public news = [];
  downloadURL: any;
  images: Observable<any[]>;

  constructor(public firebaseService: FirebaseService,public afStorage: AngularFireStorage) { }

  ngOnInit() {
    this.afStorage.ref("/news/analitycs.jpg").getDownloadURL().subscribe(downloadURL => {
      this.images = downloadURL;
      console.log(this.images);
    });
    this.downloadURL = this.afStorage.ref('/news/leo').getDownloadURL();
    console.log(this.downloadURL);
    // this.showImages();
    this.firebaseService.getNews()
    .subscribe((result) => {
      this.news = [];
      result.forEach((newsData: any)=> {
        this.news.push({
          id:   newsData.payload.doc.id,
          data: newsData.payload.doc.data()
        });
      });
      console.log(this.news);
    });
    this.firebaseService.getNews()
    .subscribe(result => {
      console.log(result);
    });
  }
  openCreateForm(){
    this.create = true;
  }
  createNew(newsForm, value){
    console.log(value);
  this.firebaseService.createNews(value)
	.then(
	  res => {
	    this.getNews();
	    // this.router.navigate(['/home']);
	  });
  }

  getNews(){
    this.firebaseService.getNews()
    .subscribe(result => {
      console.log(result);
    });
  }
  upload(event) {
    console.log(event.target.files[0].name);
    this.afStorage.upload('/news/'+event.target.files[0].name,event.target.files[0]);
  }
  // saveImages(form, value){
  //   console.log(value.img);
  //   this.firebaseService.uploadFile(value.img)
  //   .subscribe(result => {
  //     console.log(result);
  //   }, err =>{
  //     console.log(err);
  //   });
  // }


}
