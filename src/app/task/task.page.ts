import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseAuthService } from '../firebase-auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User, auth } from 'firebase/app';





@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {
  currentUser: User;
  userProviderAdditionalInfo: any;
  public  lenghttasks;
  Id : String;
  
  tasks = [];
  constructor(
    public afDB: AngularFireDatabase,
    public angularFireAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    private authService: FirebaseAuthService) {
    this.getTasks();
    this.angularFireAuth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.currentUser = user;
        this.Id = this.currentUser.uid
        console.log(this.Id)
        
      } else {
        // No user is signed in.
        this.currentUser = null;
      }
    });
  
  
    

   }


  //  To get the tasks from database
  getTasks() {
    this.afDB.list('Tasks/').snapshotChanges(['child_added', 'child_removed']).subscribe(actions => {
      this.tasks = [];
      
      actions.forEach(action => {
        if(action.payload.exportVal().idUser == this.Id && action.payload.exportVal().checked == false ){
        this.tasks.push({
          key: action.key,
          text: action.payload.exportVal().text,
          hour: action.payload.exportVal().date.substring(11, 16),
          checked: action.payload.exportVal().checked,
          tasklength : this.tasks.length+1

        });
      }
        this.lenghttasks = this.tasks.length;

      });


    });
    return this.lenghttasks;
  }
  ngOnInit() {
   
 }
  

}
