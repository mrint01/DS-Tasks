import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subject, from } from 'rxjs';
import { Platform } from '@ionic/angular';
import { User, auth } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';



@Injectable()
export class FirebaseAuthService {

  currentUser: User;
  Id : String;
  userProviderAdditionalInfo: any;
  redirectResult: Subject<any> = new Subject<any>();

  constructor(
    public angularFireAuth: AngularFireAuth,
    public platform: Platform,
    private firestore: AngularFirestore

  ) {
    this.angularFireAuth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.currentUser = user;
        
        //console.log(this.currentUser.uid);
      } else {
        // No user is signed in.
        this.currentUser = null;
      }
    });

    // when using signInWithRedirect, this listens for the redirect results
    this.angularFireAuth.getRedirectResult()
    .then((result) => {
      // result.credential.accessToken gives you the Provider Access Token. You can use it to access the Provider API.
      if (result.user) {
        this.setProviderAdditionalInfo(result.additionalUserInfo.profile);
        this.currentUser = result.user;
        this.redirectResult.next(result);
      }
    }, (error) => {
      this.redirectResult.next({error: error.code});
    });
  }


  readData() {     
    return this.firestore.collection('Users').snapshotChanges();
  }
  getRedirectResult(): Observable<any> {
    return this.redirectResult.asObservable();
  }

  setProviderAdditionalInfo(additionalInfo: any) {
    this.userProviderAdditionalInfo = {...additionalInfo};
  }

  signOut(): Observable<any> {
    return from(this.angularFireAuth.signOut());
  }

  signInWithEmail(email: string, password: string): Promise<auth.UserCredential> {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  signUpWithEmail(email: string, password: string): Promise<auth.UserCredential> {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }
}
