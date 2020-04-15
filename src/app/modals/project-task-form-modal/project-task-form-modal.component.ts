import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project-task-form-modal',
  templateUrl: './project-task-form-modal.component.html',
  styleUrls: ['./project-task-form-modal.component.scss']
})
export class ProjectTaskFormModalComponent implements OnInit {
  public tasksList;
  public project_tasks;
  registerForm: FormGroup;
  submitted = false;
  public filteredList: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  private _onDestroy = new Subject<void>();
  public listFilterCtrl: FormControl = new FormControl();
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<ProjectTaskFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
    this.firestore.collection('projects/'+this.data.projectId+'/tasks').snapshotChanges().subscribe(data => {
      this.project_tasks= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.project_tasks',this.project_tasks);
    });

    this.firestore.collection('tasks',ref=>ref.where('isActive','==',true)).snapshotChanges().subscribe(data => {
      let tasks= data.map(e => {
        return {
         id: e.payload.doc.id,
         ...e.payload.doc.data() as object
        } 
      })

      for( var i=tasks.length - 1; i>=0; i--){
        for( var j=0; j<this.project_tasks.length; j++){
            if(tasks[i] && (tasks[i].id === this.project_tasks[j].taskId)){
              tasks.splice(i, 1);
            }
        }
    }
    this.tasksList=tasks;
    console.log('this.tasksList',this.tasksList);
    
  
     this.filteredList.next(this.tasksList.slice());
        this.listFilterCtrl.valueChanges
           .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterList();
           });
    });

    this.registerForm = this.formBuilder.group({
        id: [],
        taskId: ['', Validators.required]
    });
      if (this.data.item!==undefined) {
        this.registerForm.controls.id.setValue(this.data.item.id);
        this.registerForm.controls.taskId.setValue(this.data.item);
        console.log(this.data);
      }
  }

  get f() { return this.registerForm.controls; }

  
  private filterList() {
    if (!this.tasksList) {
      return;
    }
    let search = this.listFilterCtrl.value;
    if (!search) {
      this.filteredList.next(this.tasksList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredList.next(
      this.tasksList.filter(bank => bank.name.toLowerCase().indexOf(search) > -1 )
     
    );
}
  
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }    
       

  if (this.registerForm.value.id==null) {
      for (let i = 0; i < this.registerForm.value.taskId.length; i++) {
    let body=
    { 
      taskId: this.registerForm.value.taskId[i].id,
      logType:this.registerForm.value.taskId[i].logType,
      name: this.registerForm.value.taskId[i].name,
      taskType: this.registerForm.value.taskId[i].taskType
    }
    console.log(body);
        this.firestore.collection('projects/'+this.data.projectId+'/tasks').add(body).then(()=>{
          this.toastrService.success('Record added successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        })         
    }
  }
    else {     
      let body=
    { 
      taskId: this.registerForm.value.taskId.id,
      logType:this.registerForm.value.taskId.logType,
      name: this.registerForm.value.taskId.name,
      taskType: this.registerForm.value.taskId.taskType
    }
      this.firestore.collection('projects/'+this.data.projectId+'/tasks').doc(this.registerForm.value.id).update(body).then(()=>{
        this.toastrService.success('Record updated successfully !', 'Success');
      }).catch((error) => {
        this.toastrService.error(error.message);
      }) 
    }
    
    this.closeModal();
  }

  closeModal() {
    this.dialog.closeAll();
  }
 
  ngOnDestroy() {
    this._onDestroy.next();
   this._onDestroy.complete();
  }

}
