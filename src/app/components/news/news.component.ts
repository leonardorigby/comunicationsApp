import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';

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
  url: any;
  imagePath: string = "/news/be-creative-creative-drawing-256514.jpg";
  imageRef: any;
  targetFile: any;

  public newsArray: Array<{title: string, description: string, picture: any, admin: string, creationDate: string, finishDate: string, likes: number, dislikes: number}> = [];

  constructor(public firebaseService: FirebaseService,public afStorage: AngularFireStorage) { }

  ngOnInit() {
    // this.afStorage.ref("/news/analitycs.jpg").getDownloadURL().subscribe(downloadURL => {
    //   this.images = downloadURL;
    // });
    // this.downloadURL = this.afStorage.ref('/news/leo').getDownloadURL();
    // console.log(this.downloadURL);

    this.getAllNews();
  }

  // get all news function
  getAllNews(){
    this.firebaseService.getNews()
    .subscribe((result) => {
      this.newsArray = [];
      result.forEach((newsData: any)=> {
          var data = newsData.payload.doc.data();
          console.log(data);
          this.afStorage.ref(data.picture).getDownloadURL().subscribe(downloadURL => {
            this.images = downloadURL;
            this.newsArray.push({
              title: data.title,
              description: data.description,
              picture: this.images,
              admin: data.admin,
              creationDate: data.creationDate,
              finishDate: data.finishDate,
              likes: data.likes,
              dislikes: data.dislikes
            });
          });

        // this.newsArray.push({
        //   title:   newsData.payload.doc.id,
        //   data: newsData.payload.doc.data()
        // });
      });
      // console.log(this.news);
      // var records = this.news;
      // if(this.news.length>=2){

        // for(var i = 0;i<=records.length; i++){
        //
        // }

      // }
      console.log(this.newsArray);

    });

  }

  recordNews(records){
    console.log(records);
  }

  openCreateForm(){
    this.create = true;
  }

  createNew(newsForm, value){
    var creationDate = formatDate(new Date(),'yyyy-MM-dd','en');
    var extradata= {
      admin: "Leonardo Rigby C",
      creationDate: creationDate,
      likes: 0,
      dislikes: 0
    };
    if(this.url){
      var imgRef =  '/news/'+this.imageRef;
      this.afStorage.upload(imgRef, this.targetFile);
      console.log("imagen guardada?");

      this.firebaseService.createNews(value, imgRef, extradata)
    	.then(
    	  res => {
          console.log(res);
    	    this.getNews();
    	    // this.router.navigate(['/home']);
    	  });
    }
  }

  getNews(){
    this.firebaseService.getNews()
    .subscribe(result => {
      console.log(result);
    });
  }

  loadImage(event) {
    console.log(event);
    console.log(event.target.files[0]);

    if (event.target.files && event.target.files[0]) {
      this.targetFile = event.target.files[0];
      this.imageRef = event.target.files[0].name;

        var reader = new FileReader();
        reader.onload = (event:any) => {

            this.url = event.target.result;
              }
        reader.readAsDataURL(event.target.files[0]);
      }
  // function to upload image to firebase
  // this.afStorage.upload('/news/'+event.target.files[0].name,event.target.files[0]);
}


}
