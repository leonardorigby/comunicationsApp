
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';



import { Departamento, Planta } from '../notificaciones/notificaciones.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';





@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {


  @ViewChild('preview',{static:false} ) preview: ElementRef<any>;

  public imagenFile: File = undefined;


  
  public departamentos : Departamento[] = [];
  public plantas: Planta[] = [];
  private usuarioAutor: User;
  public formaNoticia: FormGroup;
 

  public encontrado: boolean;
  public nombreUsuario : string = '';
  public usuarioToken : string = '';


  constructor(private router: Router,
    public firebaseService: FirebaseService,
    public afStorage: AngularFireStorage,
    public auth: AuthService,
    private httpService: HttpClient
    ) { }


  ngOnInit() {

    console.log('Notificaciones activadas...');

    this.cargarNoticiaForm();
    this.cargarZonas();

    this.auth.getUserData().subscribe( usuario => this.usuarioAutor = usuario );

    


  }




  public cargarImagen(event){

      const reader = new FileReader();

    reader.readAsDataURL( event.target.files[0] );
  
      reader.onload =( eventR : any)=>{
        
        this.imagenFile = event.target.files[0];

        this.preview.nativeElement.src = eventR.target.result;

        //console.log('La imagen se cargo', this.imagen);

      }

      

  }

private subirImagen(){

    const form = new FormData();
    form.append('upload_preset','sanminaNews' )
    form.append('file', this.imagenFile);


    return this.httpService.post<any>(`https://api.cloudinary.com/v1_1/dlor7n05z/upload`, form ).toPromise();
  
  }

 

  public imgError(){
    //this.imagen = 'assets/images/error-404-not-found.jpg'
  }



public mostrarNoticia(){

  console.log( this.formaNoticia.value );


}

  

  private cargarZonas(){


    this.firebaseService.getDepartaments().snapshotChanges().subscribe( departamentos =>{

     
      departamentos.forEach( departamento =>{

     
      const  { name }  =  departamento.payload.toJSON() as any ;

      this.departamentos.push( { $key : departamento.key , name , check: false})


      });

     console.log('Los departamentos');
    
     console.table(this.departamentos);
     
      
    });

    this.firebaseService.getPlants().snapshotChanges().subscribe( plantas =>{

   

     plantas.forEach( planta =>{

      const { name } = planta.payload.toJSON() as any;

      this.plantas.push({ $key : planta.key , name , check: false})

     });

   

    
     console.log('Las plantas',);
     console.table(  this.plantas );

    });



  }



  

  private cargarNoticiaForm (){

    this.formaNoticia = new FormGroup({

      titulo: new FormControl(null, Validators.required ),

      categoria: new FormControl(null, Validators.required ),

      encuesta : new FormControl(false, Validators.required ),

      descripcion: new FormControl(null, Validators.required),

      endDate: new FormControl(null, Validators.required),

      tituloNotificacion: new FormControl(null, Validators.required ),

      cuerpo: new FormControl(null, Validators.required )



    });


  };



  //https://drive.google.com/file/d/0B9JJFuhX3qX3VU85U0MyLUpHQXc/view?usp=sharing

  public async publicarNoticia(notificacion:string){

    console.log('Valores del formulario', this.formaNoticia.value );
   
    const admin = {
      id: this.usuarioAutor.id,
      image: this.usuarioAutor.image,
      name: this.usuarioAutor.fullName,
      number: this.usuarioAutor.employeeNumber
    };

    let idImagen ="";

  if( ! this.formaNoticia.value.encuesta ){

    idImagen = ( await this.subirImagen() ).public_id.split('/')[1];
    console.log('La encuesta es falso y se subio la imagen', idImagen);

    }

    const noticia = {
      titulo : this.formaNoticia.value.titulo,
      categoria: this.formaNoticia.value.categoria,
      urlImg: idImagen,
      encuesta:this.formaNoticia.value.encuesta,
      descripcion: this.formaNoticia.value.descripcion,
      endDate: this.formaNoticia.value.endDate,
      cuerpo : this.formaNoticia.value.cuerpo
     };



     this.firebaseService.crearNoticia( noticia , admin )
    .then(  creada => {

      //console.log('Se creo la noticia', creada);
      
      this.firebaseService.getNew( creada.id ).subscribe( noticia =>{


        const definitiva = {
          ...noticia.payload.data() as any,
          key: creada.id
        }

        console.log('Actualizada con id', definitiva);

        this.firebaseService.updateNew(creada.id, definitiva)
        .then( () =>{
          
          switch( notificacion ){

            case 'todos':
      
            this.enviarATodos();
        
            break;
      
            case 'usuario':
      
            this.enviarAUsuario();
      
            break;
      
      
            default:
      
            this.enviarATopics();
            
          }

          this.formaNoticia.reset({
            titulo :null,
            categoria:null,
            encuesta:false,
            descripcion:null,
            endDate:null,
            cuerpo:null
          });


          this.imagenFile = undefined;
          
          this.preview.nativeElement.src = 'https://res.cloudinary.com/dlor7n05z/image/upload/v1609353742/noticias/fotoIcono_m7misx.png';




        })
        .catch(err => console.log('Error al actualizar la noticia',err) );


      }) 
    
    })
    
    .catch( err => console.log('Error en el proceso  de crear una noticia ', err) );
    
    // console.log('Se creo la noticia');
      
    



    console.log('Admin de la noticia', admin);

  }



  public enviarATodos(){

    const headers = new HttpHeaders({
      'Authorization': environment.fcmKey
    });

    const notificacionBody = {
      notification:{
        title: this.formaNoticia.value.tituloNotificacion,
        body: this.formaNoticia.value.cuerpo
      },
      to:'/topics/all'
    };

   return this.httpService.post('https://fcm.googleapis.com/fcm/send', notificacionBody ,{ headers })
    .toPromise()
    .then( resp =>{
      console.log('Talves se envio', resp);
     

    })
    .catch(err => console.log('Error al enviar notificacion para uno', err) );
    

  }

  public enviarAUsuario(){

    const headers = new HttpHeaders({
      'Authorization': environment.fcmKey
    });

    const notificacionBody = {
      notification:{
        title: this.formaNoticia.value.tituloNotificacion,
        body: this.formaNoticia.value.cuerpo
      },
      to: this.usuarioToken
    };

   return this.httpService.post('https://fcm.googleapis.com/fcm/send', notificacionBody ,{ headers })
    .toPromise()
    .then( resp =>{
      console.log('Talves se envio', resp);
     

    })
    .catch(err => console.log('Error al enviar notificacion para uno', err) );


  }

  public buscarUsuario(){
    
    this.firebaseService.getUserTokenByName(  this.nombreUsuario )
    .subscribe( resp =>{

      console.log('Asi llega la resp', resp);

     if( resp.length != 0 && (resp[0].payload.doc.data() as User).token ){

      console.log('Usuario encontrado con token', resp[0].payload.doc.data() as User );
      
      this.usuarioToken  = (resp[0].payload.doc.data() as User).token;

      this.encontrado = true;

     }else{

      console.log('No se encontro el usuario o no a configurado las actualizaciones');
      this.encontrado = false;

     }
     

    }, err => console.log(err) );

  }


  
  public enviarATopics(){
    

    const seleccionados = this.departamentos.filter( topic => topic.check == true );


    this.plantas.forEach( planta =>{
      if( planta.check ) seleccionados.push( {  $key: planta.$key , name: planta.name , check:true });
    });


    console.log('Los seleccionados en total son : ', seleccionados );

    let aux:string='';

      seleccionados.forEach( async(topic, index) => {
      
        aux += `'${topic.$key}' in topics ||`
        

        if( (index +1 ) == seleccionados.length &&  seleccionados.length <= 5 ){

          aux = aux.substring(0, aux.length-2);

          console.log('Se enviaran 5 o  menos', aux);
         this.enviarNotificacionATopics( aux );
          
          aux ='';

        }

        else if( (index +1 ) % 5 == 0  ){
  
          aux = aux.substring(0, aux.length-2);

          console.log('Se enviaran 5 a', aux);
       await this.enviarNotificacionATopics( aux );
        aux ='';
          
          
        }else if( seleccionados.length > 5 && (index +1 ) == seleccionados.length ){

          aux = aux.substring(0, aux.length-2);

          console.log('Se enviaran los que sobran', aux);
          this.enviarNotificacionATopics( aux );
          
          aux =''; 

        }
  
  
      
      } );


     

    // }
     
   
  }


  private enviarNotificacionATopics( condition:string ){

    const notificacionBody = {
      notification:{
        title: this.formaNoticia.value.tituloNotificacion,
        body: this.formaNoticia.value.cuerpo
      },
      condition
    };

    const headers = new HttpHeaders({
      'Authorization': environment.fcmKey
    });

   return this.httpService.post('https://fcm.googleapis.com/fcm/send', notificacionBody ,{ headers })
    .toPromise()
    .then( resp =>{
      console.log('Talves se envio', resp);
    })
    .catch(err => console.log('Error al enviar notificacion para uno', err) );

  }














 









}
