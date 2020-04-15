import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
@Component({
  selector: 'app-task-type-form-modal',
  templateUrl: './task-type-form-modal.component.html',
  styleUrls: ['./task-type-form-modal.component.scss']
})
export class TaskTypeFormModalComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  public taskTypesList;
  public typeList;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public dialogRef: MatDialogRef<TaskTypeFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
    this.registerForm = this.formBuilder.group({
        id: [],
        types: []
    });
    this.firestore.collection('taskTypes').snapshotChanges().subscribe(data => {
      this.taskTypesList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      this.typeList=this.taskTypesList[0].types;
      console.log('types : ',this.taskTypesList[0].types)
    });
  }

  get f() { return this.registerForm.controls; }


  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }    
        let body=
        { 
          types: this.typeList
        }
        console.log(body);
    
      this.firestore.collection('taskTypes/').doc('taskType').update(body).then(()=>{
        this.toastrService.success('Record updated successfully !', 'Success');
      }).catch((error) => {
        this.toastrService.error(error.message);
      }) 
    this.closeModal();
  }

  closeModal() {
    this.dialog.closeAll();
  }

  
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.typeList.push( value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(type): void {
    const index = this.typeList.indexOf(type);

    if (index >= 0) {
      this.typeList.splice(index, 1);
    }
  }

 
}
