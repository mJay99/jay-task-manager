import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader/loader.service';
import { Task } from 'src/app/core/data-models/task.model';
import { TaskService } from 'src/app/core/services/task/task.service';
import { AlertService, UserService } from 'src/app/core/services';

declare var  $ :any;
@Component({
  selector: 'app-create-update-task',
  templateUrl: './create-update-task.component.html',
  styleUrls: ['./create-update-task.component.scss'],
})
export class CreateUpdateTaskComponent implements OnInit {
  public task: Task = new Task();
  public closeResult: any;

  constructor(
    private taskService : TaskService,
    private userService : UserService,
    private alertService : AlertService,
    private loaderService : LoaderService,
  ) { }

  @Input() taskToEdit: any;
  @Input() isEdit: boolean = false;

  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() relaodTasks: EventEmitter<any> = new EventEmitter();

  users = [];
  usersBuffer = [];
  bufferSize = 5;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;

  ngOnInit() {
    var self = this;
    if(self.isEdit){
      self.task = self.taskToEdit;
    }
    self.initializeCalender();
    self.getAllUsers();
  }

  getAllUsers(){
    var self = this;
    self.loaderService.startLoader();
    self.userService.getAllUsersList().subscribe((response: any) => {
      console.log(response);
      self.users = response.users;
      self.loaderService.stopLoader();
    }, (error) => {
      console.log(error);
      self.alertService.error(error.Message || JSON.stringify(error));
      self.loaderService.stopLoader();
    })
  }
  onScrollToEnd() {
    this.fetchMore();
}

onScroll({ end }) {
    if (this.loading || this.users.length <= this.usersBuffer.length) {
        return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.usersBuffer.length) {
        this.fetchMore();
    }
}

private fetchMore() {
    const len = this.usersBuffer.length;
    const more = this.users.slice(len, this.bufferSize + len);
    this.loading = true;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
        this.loading = false;
        this.usersBuffer = this.usersBuffer.concat(more);
    }, 200)
}

  initializeCalender() {
    let self = this;
    let  dateToday,initialDate;
    dateToday = new Date();
    if(self.task.due_date){
      initialDate = new Date(self.task.due_date);
    }else{
      initialDate = dateToday;
    }

    $('#datetimepicker').datetimepicker({
      format: "dd M yyyy - HH:ii P",
      startDate: dateToday,
      initialDate:initialDate,
      showMeridian: true,
      autoclose: true,
      todayBtn: true
    }).on('changeDate', (ev) => {
      let self = this;
      self.task.due_date = self.setCustomDateFormat(ev.date);
      console.log(self.task.due_date);

    });
    if(self.isEdit){
      $('#datetimepicker').datetimepicker('setDate',initialDate)
    }


  }
setCustomDateFormat(rawDate){
      var self = this;
      let dPart = rawDate.toISOString().match(/\d{4}-\d{2}-\d{2}/)[0]
      let tPart = rawDate.toISOString().match(/\d{2}:\d{2}:\d{2}/)[0]
      return `${dPart} ${tPart}`
}

saveTask(){
  var self = this;
  var data = new FormData();
  let  task = {...self.task}
  let keys = Object.keys(task);

  keys.forEach((key:string) => {
    if(key != "id"){
      data.append(key,task[key])
    }
   });
   self.loaderService.startLoader();
  self.taskService.createNewTask(data).subscribe((response: any) => {
    console.log(response);
    self.alertService.success('Task has been created successfully');
    self.loaderService.stopLoader();
    self.relaodTasks.emit();
    self.close.emit()
  }, (error) => {
    console.log(error);
    self.alertService.error(error.Message || JSON.stringify(error));
    self.loaderService.stopLoader();
  })
}
updateTask(task:Task){
  var self = this;
  var data = new FormData();
  let  task_to_edit = {...self.task}
  let keys = Object.keys(task_to_edit)

  keys.forEach((key:string) => {
    if(key === "id"){
      data.append("taskid",task_to_edit[key])
    }else{
      data.append(key,task_to_edit[key])
    }
      
   });
   self.loaderService.startLoader();
  self.taskService.updateTask(data).subscribe((response: any) => {
    console.log(response);
    self.alertService.success('Task has been updated successfully');
    self.relaodTasks.emit();
    self.close.emit()
    self.loaderService.stopLoader();
  }, (error) => {
    console.log(error);
    self.alertService.error(error.Message || JSON.stringify(error));
    self.loaderService.stopLoader();
  })
}

  cancel() {
    var self = this;
    self.close.emit()
  }

}
