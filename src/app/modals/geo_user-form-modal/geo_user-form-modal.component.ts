import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-geo_user-form-modal',
  templateUrl: './geo_user-form-modal.component.html',
  styleUrls: ['./geo_user-form-modal.component.scss']
})
export class Geo_userFormModalComponent implements OnInit {
  hide = true;
  registerForm: FormGroup;
  submitted = false;
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<Geo_userFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
    this.registerForm = this.formBuilder.group({
        id: [],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        abc:['', [Validators.required,Validators.email]],
        phone: ['', Validators.required],
        def: ['', [Validators.required,Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
    }, {
        validator: MustMatch('def', 'confirmPassword')
    });
    if (this.data.item!=undefined) {
      this.registerForm.controls.id.setValue(this.data.item.id);
      this.registerForm.controls.firstName.setValue(this.data.item.firstName);
      this.registerForm.controls.lastName.setValue(this.data.item.lastName);
      this.registerForm.controls.abc.setValue(this.data.item.email);
      this.registerForm.controls.phone.setValue(this.data.item.phone);
    }
    console.log(this.data)
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }     
  
    this.afAuth.auth.createUserWithEmailAndPassword(this.registerForm.controls.abc.value, this.registerForm.controls.def.value)
    .then((result) => {
      this.toastrService.success('User created successfully!', 'Success');
      let body1=
      { 
        firstName:this.registerForm.controls.firstName.value,
        lastName:this.registerForm.controls.lastName.value,
        email:this.registerForm.controls.abc.value,
        phone:this.registerForm.controls.phone.value,
        role:'geologist',
        isActive:true
      }
      console.log(body1);
      this.firestore.collection('users/').doc(result.user.uid).set(body1).then(()=>{
        this.toastrService.success('Role assigned successfully !', 'Success');
      }).then(()=>{
              let body2=
              { 
                uid:result.user.uid
              }
              console.log(body2);
          
            this.firestore.collection('geologists/').doc(this.registerForm.value.id).update(body2).then(()=>{
              this.toastrService.success('Geologist updated successfully !', 'Success');
            }).catch((error) => {
              this.toastrService.error(error.message);
            }) 
      }) 
      console.log(result);
    }).catch((error) => {
      this.toastrService.error(error.message);
    }) 
       
    
    this.closeModal();
  }

  closeModal() {
    this.dialog.closeAll();
  }

}


export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}