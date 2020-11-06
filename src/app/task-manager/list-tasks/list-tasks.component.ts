import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Task } from 'src/app/core/data-models/task.model';
import { User } from 'src/app/core/data-models/user.model';
import { UserService } from 'src/app/core/services';
import { TaskService } from 'src/app/core/services/task/task.service';


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
    private userService: UserService) { }

  ngOnInit() {
    var self = this;
    self.getAllUsers();
    self.getAllTasks();
  }

  createTask(content?: any) {
    var self = this;
    self.isAdd = !self.isAdd;
  }

  getAllTasks() {
    var self = this;
    self.isAdd = false;
    self.isEdit = false;
    // self.loaderService.startLoader();
    self.taskService.getAllTasksList().subscribe((response: any) => {
      console.log(response);
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

          })
        }
      }, 100);


      // self.loaderService.stopLoader();
    }, (error) => {
      console.log(error);
      // self.loaderService.stopLoader();
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
    // self.loaderService.startLoader();
    self.userService.getAllUsersList().subscribe((response: any) => {
      console.log(response);
      self.usersList = response.users;
      // self.loaderService.stopLoader();
    }, (error) => {
      console.log(error);
      // self.loaderService.stopLoader();
    })
  }


  editTask(task: Task, index) {
    var self = this;
    self.isEdit = !self.isEdit;
    self.taskToEdit = task;
    self.hideByIndex = index;
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
    self.taskService.deleteTask(data).subscribe((response: any) => {
      console.log(response);
      self.getAllTasks();
      // self.users = response.users;
      // self.loaderService.stopLoader();
    }, (error) => {
      console.log(error);
      console.log(error);
      // self.loaderService.stopLoader();
    })
  }

  clearFilterResult() {
    var self = this;
  }
}