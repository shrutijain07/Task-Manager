import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FilterPipe } from '../../pipes/filter.pipe';
declare var bootstrap: any;

@Component({
  selector: 'app-tasks',
  imports: [ReactiveFormsModule,FormsModule,CommonModule,FilterPipe],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements AfterViewInit {
  @ViewChild('closeAddUpdateModal') closeAddUpdateModal: any;
  @ViewChild('closeDeleteModal') closeDeleteModal: any;
  
  tasks: Task[] = [];
  APISubscription:Subscription[]=[];
  taskForm: any;
  searchTerm=''
  actionType: string='';
  task_id: any;
  gridView: boolean=false;

  constructor(private taskService: TaskService,private formBuilder: UntypedFormBuilder,private toastr: ToastrService,) {}

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      title: ['true', Validators.required],
      description: ['', Validators.required],
    });
     this.fetchTasks();
  }

  ngAfterViewInit() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
  setAction(action_value:string,task:any){
    this.actionType = action_value
    this.task_id = task?._id
    this.taskForm.reset()
    if(action_value === 'update'){
      this.taskForm.patchValue({
        title:task.title,
        description:task.description
      })
    }
  }

  toggleView() {
    this.gridView = !this.gridView;
  }

  trackByIndex = (index: number): number => {
    console.log('%c [ index ]-55', 'font-size:13px; background:pink; color:#bf2c9f;', index)
    return index;
  };

  fetchTasks(): void {
    this.APISubscription.push(this.taskService.getTasks().subscribe(result => {
      this.tasks = result
    }))
  }

  toggleStatus(task: Task): void {
    const updatedTask = { ...task, status: task.status === 'pending' ? 'completed' : 'pending' };
    this.APISubscription.push(this.taskService.updateTask(task._id!,updatedTask).subscribe(result => {
      this.toastr.success('Task Status Updated Successfully', '', { timeOut: 3000 });
      this.fetchTasks()
    }))
  }

  deleteTask(): void {
    this.APISubscription.push(this.taskService.deleteTask(this.task_id).subscribe(result => {
      this.closeDeleteModal.nativeElement.click();
      this.toastr.success('Task Deleted Successfully', '', { timeOut: 3000 });
      this.fetchTasks()
    }))
  }

  actionOnTask(): void {
    let data = {
      title: this.taskForm?.value.title,
      description: this.taskForm?.value.description,
    };
    if(this.actionType==='create'){
      this.APISubscription.push(this.taskService.addTask(data).subscribe(result => {
        this.closeAddUpdateModal.nativeElement.click();
        this.toastr.success('Task Created Successfully', '', { timeOut: 3000 });
        this.fetchTasks()
      }))
    }else{
      this.APISubscription.push(this.taskService.updateTask(this.task_id,data).subscribe(result => {
        this.closeAddUpdateModal.nativeElement.click();
        this.toastr.success('Task Updated Successfully', '', { timeOut: 3000 });
        this.fetchTasks()
      }))
    }
    
  }
  ngOnDestroy():void{
    if(this.APISubscription.length !== 0){
      this.APISubscription.forEach((s) => s.unsubscribe());  
    }
  }
}

