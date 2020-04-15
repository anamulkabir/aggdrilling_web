import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-unitdefinition-form-modal',
  templateUrl: './unitdefinition-form-modal.component.html',
  styleUrls: ['./unitdefinition-form-modal.component.scss']
})
export class UnitdefinitionFormModalComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
   public dialogRef: MatDialogRef<UnitdefinitionFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
    this.registerForm = this.formBuilder.group({
        id: [],
        title: ['', Validators.required]
    });
    if (this.data.item!==undefined) {
      this.registerForm.controls.id.setValue(this.data.item.id);
      this.registerForm.controls.title.setValue(this.data.item.title);
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
          title: this.registerForm.controls.title.value,
          status: true
        }
        console.log(body);

  if (this.registerForm.value.id==null) {
        this.firestore.collection('unitDefinition/').add(body).then(()=>{
          this.toastrService.success('Record added successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        })         
    }
    else {     
      this.firestore.collection('unitDefinition/').doc(this.registerForm.value.id).update(body).then(()=>{
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
