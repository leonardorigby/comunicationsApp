import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../components/models/user.model'; // optional

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

      user$: Observable<User>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router){
    // Get the auth state, then fetch the Firestore user document or return null
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
            // Logged in
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            // Logged out
            return of(null);
          }
        })
      )
    }

    async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    console.log(credential.user);
    // return this.updateUserData(credential.user);
  }
  async facebookSignin(){
    var provider = new auth.FacebookAuthProvider();
    var credential = await this.afAuth.auth.signInWithPopup(provider);
    console.log(credential.user);
  }
  googleSignUp(): any{
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then(result =>{
      console.log(result);
    });
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    console.log(user);
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      id: user.uid,
      fullName: user.displayName,
      email: user.email,
      birthDate: '23/02/1993',
      employeeNumber: '207002790',
      idDepartment: '1',
      idPlant: '2',
      idRole: '1',
      image: user.photoURL,
      authorized: true
    }
    this.router.navigate(['/news']);
    // return userRef.set(data, { merge: true })
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  }
