import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../components/models/user.model'; // optional
import { NewUser } from '../components/models/newUser.model'; // optional

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

      usuario: User;
      user$: Observable<User>;
      newUser$: Observable<NewUser>;
 

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router){
    // Get the auth state, then fetch the Firestore user document or return null
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
            // Logged in
          if (user) {
           
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
            
          } else {
            // Logged out
            this.router.navigate(['/login']);
            return of(null);
          }
        })
      )
      
      

      this.getNewUserData();
    }

    googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = this.afAuth.auth.signInWithRedirect(provider);
    return this.getUserData();
    // console.log(credential.user);
    // return this.updateUserData(credential.user);
  }
  async facebookSignin(){
    // var provider = new auth.FacebookAuthProvider();
    // var credential = await this.afAuth.auth.signInWithPopup(provider);
    //
    // return this.getUserData();
    // if(credential.)
  }

  async googleSignUp(){
    const provider = new auth.GoogleAuthProvider();
    // var result = this.afAuth.auth.signInWithPopup(provider);
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    this.createNewUserData(credential.user);

    return this.getNewUserData();

  }

  private createNewUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<NewUser> = this.afs.doc(`newUsers/${user.uid}`);

    const data = {
      id: user.uid,
      fullName: user.displayName,
      email: user.email,
      image: user.photoURL,
    };
    // this.router.navigate(['/news']);
    return userRef.set(data, { merge: true })
  }

  getNewUserData(){
    this.newUser$ = this.afAuth.authState.pipe(
      switchMap(newuser => {
          // Logged in
        if (newuser) {
        // this.router.navigate(['/news']);
          return this.afs.doc<NewUser>(`newUsers/${newuser.uid}`).valueChanges();

        } else {
          // Logged out
          return of(null);
        }
      })
    )
    return this.newUser$;
  }
  getUserData(){
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
          // Logged in
        if (user) {
        // this.router.navigate(['/newns']);
          return this.afs.doc<NewUser>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    )
    // console.log(this.user$);
    return this.user$;
  }

  registerNewUser(user){
    console.log(user);
    // console.log(user);
    // // Sets user data to firestore on login
    // return this.afs.collection('users').add(user);
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.id}`);

    // this.router.navigate(['/news']);
    return userRef.set(user, { merge: true })

  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  }
