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

  public newsArray: Array<{title: string, description: string, image: any, idplant: string, idpublication: string, iddepartament: string, startDate: string, endDate: string, like: number, notlikes: number}> = [];

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
      console.log(result);
      this.newsArray = [];
      result.forEach((newsData: any)=> {
        var id= newsData.payload.doc.id;
        console.log(id);
          var data = newsData.payload.doc.data();
          console.log(data);
           this.afStorage.ref(data.image).getDownloadURL().subscribe(downloadURL => {
            //  console.log(downloadURL);
             if(formatDate(new Date(),'yyyy-MM-dd','en')==data.endDate){
              var storageRef = this.afStorage.ref(data.image);
               // Create a reference to the file to delete
              storageRef.delete();
              // File deleted successfully
              this.firebaseService.deleteNew(id)
              console.log('se elimino a ',data);



            //   .subscribe(result=>{
            // console.log(result);
            //   });

             }else{

            this.images = downloadURL;
            this.newsArray.push({
              title: data.title,
              description: data.description,
              image: this.images,
              idplant: data.idplant,
              startDate: data.startDate,
              endDate: data.endDate,
              like: data.like,
              notlikes: data.notlike,
              iddepartament:data.iddepartament,
              idpublication:data.publication
            });
           }
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
      admin: "Angel Reyes",
      creationDate: creationDate,
      likes: 0,
      notlikes: 0,

    };
    if(this.url!=null){
      console.log(this.url);
      var imgRef =  '/img/'+this.imageRef;
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
