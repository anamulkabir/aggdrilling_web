import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-geologist-form-modal',
  templateUrl: './geologist-form-modal.component.html',
  styleUrls: ['./geologist-form-modal.component.scss']
})
export class GeologistFormModalComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<GeologistFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
    this.registerForm = this.formBuilder.group({
        id: [],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email:['', [Validators.required,Validators.email]],
        phone: ['', Validators.required],
        companyName: ['', Validators.required],
        emergencyContactName: ['', Validators.required],
        emergencyContactPhone: ['', Validators.required]
    });
    if (this.data.item!==undefined) {
      this.registerForm.controls.id.setValue(this.data.item.id);
      this.registerForm.controls.firstName.setValue(this.data.item.firstName);
      this.registerForm.controls.lastName.setValue(this.data.item.lastName);
      this.registerForm.controls.email.setValue(this.data.item.email);
      this.registerForm.controls.phone.setValue(this.data.item.phone);
      this.registerForm.controls.companyName.setValue(this.data.item.companyName);
      this.registerForm.controls.emergencyContactName.setValue(this.data.item.emergencyContactName);
      this.registerForm.controls.emergencyContactPhone.setValue(this.data.item.emergencyContactPhone);
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
          firstName:this.registerForm.controls.firstName.value,
          lastName:this.registerForm.controls.lastName.value,
          email: this.registerForm.controls.email.value,
          phone: this.registerForm.controls.phone.value,
          companyName: this.registerForm.controls.companyName.value,
          emergencyContactName: this.registerForm.controls.emergencyContactName.value,
          emergencyContactPhone: this.registerForm.controls.emergencyContactPhone.value
        }
        console.log(body);

  if (this.registerForm.value.id==null) {
        this.firestore.collection('geologists/').add(body).then(()=>{
          this.toastrService.success('Record added successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        })         
    }
    else {     
      this.firestore.collection('geologists/').doc(this.registerForm.value.id).update(body).then(()=>{
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
 
  trimming_fn(x) {    
    return x ? x.replace(/\s/g,'') : '';    
}; 

trimSpace(){
  this.registerForm.controls.email.setValue(this.trimming_fn(this.registerForm.value.email).toLowerCase());
}
 
}
