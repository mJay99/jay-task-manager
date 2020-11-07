import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUpdateTaskComponent } from './create-update-task/create-update-task.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { ListTasksComponent } from './list-tasks/list-tasks.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BoardsComponent } from './boards/boards.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PiorityPipe } from '../core/pipes/task-priority.pipe';
import { SearchByAllPipe } from '../core/pipes/search-by-all.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [CreateUpdateTaskComponent, ListUsersComponent, ListTasksComponent, BoardsComponent ,
    PiorityPipe,SearchByAllPipe],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    RouterModule,
    DragDropModule
  ]
})
export class TaskManagerModule { }
