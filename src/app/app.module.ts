import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

// firebase imports
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import {firebase} from '../environments/firebase';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AuthGuard } from './auth.guard';

import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireModule} from 'angularfire2';
import { ChartsModule } from 'ng2-charts';
// import { ChartsModule } from 'ng2-charts/ng2-charts';

import { NewsComponent } from './components/news/news.component';
import { TransportComponent } from './components/transport/transport.component';
import { FoodComponent } from './components/food/food.component';
import { HealthComponent } from './components/health/health.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PlantComponent } from './components/plant/plant.component';
import { DepartamentComponent } from './components/departament/departament.component';
import { RoleComponent } from './components/role/role.component';
import { PublicationComponent } from './components/publication/publication.component';
import { IconsComponent } from './components/icons/icons.component';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CreateComponent } from './components/create/create.component';
import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';
import { StadisticsComponent } from './components/stadistics/stadistics.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
// Nombre público del proyecto firebase AUth google
// project-625108487289

@NgModule({
  declarations: [
    AppComponent,
    NewsComponent,
    TransportComponent,
    FoodComponent,
    HealthComponent,
    UsersComponent,
    LoginComponent,
    RegisterComponent,
    PlantComponent,
    DepartamentComponent,
    RoleComponent,
    PublicationComponent,
    IconsComponent,
    CreateComponent,
    TerminosCondicionesComponent,
    StadisticsComponent,
    PerfilComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgxYoutubePlayerModule.forRoot(),
    AngularFireModule.initializeApp(firebase.firebase),
    // AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
 	  AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireMessagingModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxChartsModule,
    ChartsModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('multiples-sw.js', { enabled: environment.production })
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
