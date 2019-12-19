import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

import { NewsComponent } from './components/news/news.component';
import { TransportComponent } from './components/transport/transport.component';
import { FoodComponent } from './components/food/food.component';
import { HealthComponent } from './components/health/health.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PlantComponent } from './components/plant/plant.component';

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
    PlantComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebase.firebase),
    // AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
 	  AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
