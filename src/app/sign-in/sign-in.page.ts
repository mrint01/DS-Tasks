import { Component, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../firebase-auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: 'sign-in.page.html',
  styleUrls: ['sign-in.page.scss'],
})
export class SignInPage {
  signInForm: FormGroup;
  submitError: string;
  authRedirectResult: Subscription;

  // msg of validation of forms
  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ]
  };

  constructor(
    public angularFire: AngularFireAuth,
    public router: Router,
    private ngZone: NgZone,
    private authService: FirebaseAuthService
  ) {

     // validation of forms
    this.signInForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ]))
    });

    // Get firebase authentication redirect result invoken when using signInWithRedirect()
    this.authRedirectResult = this.authService.getRedirectResult()
    .subscribe(result => {
      if (result.user) {
        this.redirectLoggedUserToTask();
      } else if (result.error) {
        this.submitError = result.error;
      }
    });
  }

  // Once the auth provider finished the authentication flow, and the auth redirect completes,
  // redirect the user to the tasks
  redirectLoggedUserToTask() {
    // As we are calling the Angular router navigation inside a subscribe method, the navigation will be triggered outside Angular zone.
    // That's why we need to wrap the router navigation call inside an ngZone wrapper
    this.ngZone.run(() => {
      //alert("loged");
      this.router.navigate(['task']);
    });
  }
 
  // signIn with email and password
  signInWithEmail() {
    this.authService.signInWithEmail(this.signInForm.value['email'], this.signInForm.value['password'])
    .then(user => {
      // navigate to user task
      
      this.redirectLoggedUserToTask();
    })
    .catch(error => {
      this.submitError = error.message;
    });
  }

}
