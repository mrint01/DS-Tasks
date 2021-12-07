import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { FirebaseAuthService } from '../../firebase-auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { User, auth } from 'firebase/app';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})

export class TodoPage implements OnInit {
  public static  options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;
  currentDate: string;
  myTask: string;
  addTask: boolean;
  Id:String;
  tasks = [];
  currentUser: User;
  userProviderAdditionalInfo: any;


  constructor(
    public afDB: AngularFireDatabase,
    public angularFireAuth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute,
    private authService: FirebaseAuthService
    ) {
    // get the date of today
    const event = new Date();
    this.currentDate =event.toLocaleDateString(undefined, TodoPage.options);
    this.getTasks(); // call the function to get all data of tasks from database

    // get the data of Current User
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
  // this for to show the formulaire to enter new task
  showForm() {
    this.addTask = !this.addTask;
    this.myTask = '';
  }
  // this for add the task to database
  addTaskToFirebase() {
    this.afDB.list('Tasks/').push({
      text: this.myTask,
      date: new Date().toISOString(),
      checked: false,
      idUser: this.Id, // insert Task with userId 
    });
    this.showForm();
  }
//  To get the tasks from database
  getTasks() {
    this.afDB.list('Tasks/').snapshotChanges(['child_added', 'child_removed']).subscribe(actions => {
      this.tasks = [];
      actions.forEach(action => {
        if(action.payload.exportVal().idUser == this.Id){
          this.tasks.push({
            key: action.key,
            text: action.payload.exportVal().text,
            hour: action.payload.exportVal().date.substring(11, 16),
            checked: action.payload.exportVal().checked,
        
        });
      }


      });
    });
  }
// if checkbox true will change it in the database
  changeCheckState(ev: any) {
    this.afDB.object('Tasks/' + ev.key + '/checked/').set(ev.checked);
  }

  // To delete the task from database
  deleteTask(task: any) {
    this.afDB.list('Tasks/').remove(task.key);
  }
  ngOnInit() {
    
  }

  // logout
  signOut() {
    this.authService.signOut().subscribe(() => {
      // Sign-out successful.
      this.router.navigate(['sign-in']);
    }, (error) => {
      console.log('signout error', error);
    });
  }
}
