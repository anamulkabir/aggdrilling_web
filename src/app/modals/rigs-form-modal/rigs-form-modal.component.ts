import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rigs-form-modal',
  templateUrl: './rigs-form-modal.component.html',
  styleUrls: ['./rigs-form-modal.component.scss']
})
export class RigsFormModalComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<RigsFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
    this.registerForm = this.formBuilder.group({
        id: [],
        rid: ['', Validators.required],
        serial: ['', Validators.required],
        status: ['', Validators.required]
    });
    this.registerForm.controls.status.setValue('free');
    if (this.data.item!==undefined) {
      this.registerForm.controls.id.setValue(this.data.item.id);
      this.registerForm.controls.rid.setValue(this.data.item.rid);
      this.registerForm.controls.serial.setValue(this.data.item.serial);
      this.registerForm.controls.status.setValue(this.data.item.status);
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
          rid:this.registerForm.controls.rid.value,
          serial: this.registerForm.controls.serial.value,
          status: this.registerForm.controls.status.value
        }
        console.log(body);

  if (this.registerForm.value.id==null) {
        this.firestore.collection('rigs/').add(body).then(()=>{
          this.toastrService.success('Record added successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        })         
    }
    else {     
      this.firestore.collection('rigs/').doc(this.registerForm.value.id).update(body).then(()=>{
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
