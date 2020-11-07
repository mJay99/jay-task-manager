import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Task } from 'src/app/core/data-models/task.model';
import { User } from 'src/app/core/data-models/user.model';
import { AlertService, UserService } from 'src/app/core/services';
import { TaskService } from 'src/app/core/services/task/task.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { LoaderService } from 'src/app/core/services/loader/loader.service';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit {
  boardName: string = "Sample"
  searchText: string = "";
  hideByIndex;
  public usersList: User[] = [];
  assignedUser: any = {};
  public tasksList: Task[] = [];
  public isAdd: boolean = false;
  public isEdit: boolean = false;
  public taskToEdit: Task;
  public params: any;
  public closeResult: any;
  public active_user_role: string;
  constructor(private taskService: TaskService,
    private modalService: NgbModal,
    private userService: UserService,
    private alertService : AlertService,
    private loaderService : LoaderService,) { }

  ngOnInit() {
    var self = this;
    self.getAllUsers();
    self.getAllTasks();
  }

  createTask(content?: any) {
    var self = this;
    self.isAdd = !self.isAdd;
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log('Previous: ');
    // console.log(event.previousContainer.data);
    console.log('Current: ');
    console.log(event.container.data);
    const prevIndex = this.tasksList.findIndex((d) => d === event.item.data);
    // if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data,prevIndex, event.currentIndex);
      this.tasksList = [...this.tasksList];
      // event.container.data.splice(event.previousIndex, 1);
    // }
    }
  getAllTasks() {
    var self = this;
    self.isAdd = false;
    self.isEdit = false;
    self.loaderService.startLoader();
    self.taskService.getAllTasksList().subscribe((response: any) => {
      console.log(response);
      self.loaderService.stopLoader();
      self.tasksList = response.tasks;
      setTimeout(() => {
        if (self.usersList.length > 0) {
          self.tasksList.forEach(task => {
            this.usersList.forEach(user => {
              if (user.id === task.assigned_to) {
                this.assignedUser[task.assigned_to] = user
              }
            });
            console.log(this.assignedUser);
            self.loaderService.stopLoader();
          })
        }
      }, 100);


    }, (error) => {
      console.log(error);
      self.alertService.error(error.Message || JSON.stringify(error));
      self.loaderService.stopLoader();
    })
  }

  getAssinedUser(id) {
    this.usersList.forEach(user => {
      if (user.id === id) {
        return user
      }
    });
  }

  getAllUsers() {
    var self = this;
    self.loaderService.startLoader();
    self.userService.getAllUsersList().subscribe((response: any) => {
      console.log(response);
      self.usersList = response.users;
      self.loaderService.stopLoader();
    }, (error) => {
      console.log(error);
      self.alertService.error(error.Message || JSON.stringify(error));
      self.loaderService.stopLoader();
    })
  }


  editTask(task: Task, index) {
    var self = this;
    if(!self.hideByIndex){
      self.isEdit = !self.isEdit;
      self.taskToEdit = task;
      self.hideByIndex = index;
    }
   
  }

  close() {
    var self = this;
    self.isAdd = false;
    self.isEdit = false;
    self.hideByIndex = undefined;

  }

  deleteTask(task: Task) {
    var self = this;
    var data = new FormData();
    data.append("taskid", task.id)
    self.loaderService.startLoader();
    self.taskService.deleteTask(data).subscribe((response: any) => {
      console.log(response);
      self.alertService.success('Task has been deleted successfully');
      self.getAllTasks();
      self.loaderService.stopLoader();
    }, (error) => {
      console.log(error);
      self.alertService.error(error.Message || JSON.stringify(error));
      self.loaderService.stopLoader();
    })
  }

  clearFilterResult() {
    var self = this;
  }
}
