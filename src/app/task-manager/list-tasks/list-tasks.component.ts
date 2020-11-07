import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/core/data-models/task.model';
import { User } from 'src/app/core/data-models/user.model';
import { AlertService} from 'src/app/core/services';
import { TaskService } from 'src/app/core/services/task/task.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { LoaderService } from 'src/app/core/services/loader/loader.service';
import { forkJoin} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

declare var  $ :any;

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
  public origanalTasksList: Task[] = [];
  public origanalDoneList: Task[] = [];
  public activeFilter:string = "0";
  public doneList: Task[] = [];
  public isActive:string = "All";
  public isAdd: boolean = false;
  public isEdit: boolean = false;
  public taskToEdit: Task;
  public params: any;
  public closeResult: any;
  public active_user_role: string;
  constructor(private taskService: TaskService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private http: HttpClient) { }

  ngOnInit() {
    var self = this;
    self.getTasksAndUsers();
    self.initializeCalender();
  }

  createTask() {
    var self = this;
    self.isAdd = !self.isAdd;
  }

  setActive() {
    if (this.isActive === "In progress") {
      this.isActive = "Done"
    } else if (this.isActive === 'Done') {
      this.isActive = "All";
    }
    else {
      this.isActive = "In progress"
    }

  }

  public get checkAssignedUser() {
    return Object.keys(this.assignedUser).length > 0
  }


  drop(event: CdkDragDrop<string[]>) {
    console.log(event.container.data);
    const doneprevIndex = this.tasksList.findIndex((d) => d === event.item.data);
    const prevIndex = this.tasksList.findIndex((d) => d === event.item.data);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, prevIndex, event.currentIndex);
      this.tasksList = [...this.tasksList];
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, doneprevIndex, event.currentIndex);
      this.doneList = [...this.doneList];
      this.tasksList = [...this.tasksList];


    }

  }

  initializeCalender() {
    let self = this;
    let  dateToday;
    let initialDate;
    dateToday = new Date();
    initialDate = dateToday;

    $('.form_datetime').datetimepicker({
      format: "dd M yyyy",
      startDate: dateToday,
      initialDate:initialDate,
      showMeridian: true,
      autoclose: true,
      todayBtn: true
    }).on('changeDate', (ev) => {
      let self = this;
      let dateParam = self.setCustomDateFormat(ev.date);
      self.filterByDate(dateParam);

    });
    }
setCustomDateFormat(rawDate){
      var self = this;
      let dPart = rawDate.toISOString().match(/\d{4}-\d{2}-\d{2}/)[0]
      // let tPart = rawDate.toISOString().match(/\d{2}:\d{2}:\d{2}/)[0]
      return `${dPart}`
}

  getAssinedUser(id) {
    this.usersList.forEach(user => {
      if (user.id === id) {
        return user
      }
    });
  }

  getTasksAndUsers() {
    var self = this;
    self.isAdd = false;
    self.isEdit = false;
    let tasks = self.http.get(environment.baseUrl + 'list');
    let users = self.http.get(environment.baseUrl + 'listusers');
    self.loaderService.startLoader();
    forkJoin([tasks, users]).subscribe(
      (data: any) => {
        self.loaderService.stopLoader();
        self.origanalTasksList = [...data[0].tasks]; 
        self.tasksList = data[0].tasks;
        self.usersList = data[1].users;
        self.setAssignedUser();

      },
      (error) => {
        console.log(error);
        self.alertService.error(error.Message || JSON.stringify(error));
        self.loaderService.stopLoader();
      })

  }

  setAssignedUser() {
    var self = this;
    self.tasksList.forEach(task => {
      self.usersList.forEach(user => {
        if (user.id === task.assigned_to) {
          self.assignedUser[task.assigned_to] = user
        }
      });
    })
  }

  editTask(task: Task, index) {
    var self = this;
    if (!self.hideByIndex) {
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
      self.getTasksAndUsers();
      self.loaderService.stopLoader();
    }, (error) => {
      console.log(error);
      self.alertService.error(error.Message || JSON.stringify(error));
      self.loaderService.stopLoader();
    })
  }

  filterBy(filterByThis:string){
   var self = this;
   self.isActive = "In progress"
   if(self.activeFilter === '0'){
     self.activeFilter = filterByThis;
       self.tasksList = self.origanalTasksList;
       self.tasksList = self.tasksList.filter(task=>task.priority === filterByThis);
   }
   else{
     self.activeFilter = "0";
        self.tasksList = self.origanalTasksList;
   }
  }

  filterByDate(filterByThis: any) {
    var self = this;
    self.activeFilter = filterByThis;
    self.tasksList = self.origanalTasksList;
    self.tasksList = self.tasksList.filter((task: Task) => {
      if (task.due_date) {
        let rawDate = new Date(task.due_date);
        let date = self.setCustomDateFormat(rawDate)
        return date == filterByThis
      }
    })

  }


  clearFilterResult() {
    var self = this;
      self.activeFilter = "0";
      self.tasksList = self.origanalTasksList;
  }
}
