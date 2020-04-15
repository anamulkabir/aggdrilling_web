import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-form-modal',
  templateUrl: './task-form-modal.component.html',
  styleUrls: ['./task-form-modal.component.scss']
})
export class TaskFormModalComponent implements OnInit {
  public logTypesList;
  public lTypeList;
  public taskTypesList;
  public tTypeList;
  registerForm: FormGroup;
  submitted = false;
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<TaskFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
    this.registerForm = this.formBuilder.group({
        id: [],
        name: ['', Validators.required],
        logType: ['', Validators.required],
        taskType: ['', Validators.required],
        description: ['', Validators.required],
        isActive:[]
    });
    this.firestore.collection('logTypes').snapshotChanges().subscribe(data => {
      this.logTypesList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      this.lTypeList=this.logTypesList[0].types;
      console.log('types : ',this.logTypesList[0].types)
    });
    this.firestore.collection('taskTypes').snapshotChanges().subscribe(data => {
      this.taskTypesList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      this.tTypeList=this.taskTypesList[0].types;
      console.log('types : ',this.taskTypesList[0].types)
    });
    this.registerForm.controls.isActive.setValue(true);
    if (this.data.item!==undefined) {
      this.registerForm.controls.id.setValue(this.data.item.id);
      this.registerForm.controls.name.setValue(this.data.item.name);
      this.registerForm.controls.logType.setValue(this.data.item.logType);
      this.registerForm.controls.taskType.setValue(this.data.item.taskType);
      this.registerForm.controls.description.setValue(this.data.item.description);
      this.registerForm.controls.isActive.setValue(this.data.item.isActive);
    }
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }    
        let body=
        { 
          name:this.registerForm.controls.name.value,
          logType: this.registerForm.controls.logType.value,
          taskType: this.registerForm.controls.taskType.value,
          description: this.registerForm.controls.description.value,
          isActive: this.registerForm.controls.isActive.value,
        }
        console.log(body);
  
        
     
  if (this.registerForm.value.id==null) {
      this.firestore.collection('tasks/').add(body).then(()=>{
        this.toastrService.success('Record added successfully !', 'Success');
      }).catch((error) => {
        this.toastrService.error(error.message);
      })         
    }
    else {     
      this.firestore.collection('tasks/').doc(this.registerForm.value.id).update(body).then(()=>{
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
 
}
