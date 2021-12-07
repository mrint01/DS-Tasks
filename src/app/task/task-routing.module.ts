import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskPage } from './task.page';

const routes: Routes = [
  {
    path: '',
    component: TaskPage,
    /* thos are the children of the tab , todo and done , with this
        children  the tab will show in each page done and todo */
    children: [
      {
        path: 'todo',
        loadChildren: () => import('./todo/todo.module').then( m => m.TodoPageModule)
      },
      {
        path: 'done',
        loadChildren: () => import('./done/done.module').then( m => m.DonePageModule)
      }
    ]
  },
  // this path of todo page
  {
    path: 'todo',
    loadChildren: () => import('./todo/todo.module').then( m => m.TodoPageModule)
  },
  // this path of done page
  {
    path: 'done',
    loadChildren: () => import('./done/done.module').then( m => m.DonePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskPageRoutingModule {}
