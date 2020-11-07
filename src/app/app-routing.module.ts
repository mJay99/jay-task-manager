import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { BoardsComponent } from './task-manager/boards/boards.component';
import { ListTasksComponent } from './task-manager/list-tasks/list-tasks.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard' , pathMatch:"full" },
  // { path: 'login', component: DefaultLoginComponent },

  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [],
    children: [
      { path: '',   redirectTo: 'tasks',pathMatch:"full" },
      { path: 'tasks', component: ListTasksComponent },
      { path: 'boards', component: BoardsComponent },
     
    ]
  },

  // { path: '**', component: NoDataFoundComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
