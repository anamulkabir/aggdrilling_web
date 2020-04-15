import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-create-modal',
  templateUrl: './user-create-modal.component.html',
  styleUrls: ['./user-create-modal.component.scss']
})
export class UserCreateModalComponent implements OnInit {
  public loading=false;
  hide = true;
  registerForm: FormGroup;
  submitted = false;
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private http:HttpClient,private formBuilder: FormBuilder,
    private firestore:AngularFirestore,public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<UserCreateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

   
  }

  ngOnInit() { 
    this.registerForm = this.formBuilder.group({
    abc: ['', [Validators.required,Validators.email]],
    def: ['', [Validators.required,Validators.minLength(6)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', Validators.required],
    role: ['', Validators.required],
    confirmPassword: ['', Validators.required]
}, {
    validator: MustMatch('def', 'confirmPassword')
});
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }
    this.loading=true;
//////// using firebase-admin-sdk in from express.js for creating user from only admin panel
 
// var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json'});
//     this.http.post("http://localhost:8000/create", JSON.stringify({ email:this.registerForm.controls.abc.value, password: this.registerForm.controls.def.value}), { headers: reqHeader })
//        .subscribe((res)=>{
//          console.log(res);
//                     if(res["status"]=="Success")
//                            {
//                             this.toastrService.success('User created successfully!',res['status']);
//                             let body=
//                               { 
//                                 firstName:this.registerForm.controls.firstName.value,
//                                 lastName:this.registerForm.controls.lastName.value,
//                                 email:this.registerForm.controls.abc.value,
//                                 phone:this.registerForm.controls.phone.value,
//                                 role: this.registerForm.controls.role.value,
//                                 isActive: true
//                               }
//                               this.firestore.collection('users/').doc(res['uid']).set(body).then(()=>{
//                                 this.toastrService.success('Role assigned successfully !', 'Success');
//                               })
//                               this.loading=false;
//                               this.closeModal(); 
//                            }
//                       else{
//                         this.loading=false;
//                         this.toastrService.error(res['msg'],res['status']);
//                       }        
//                     }, 
//                     (error:HttpErrorResponse) => {
//                       this.loading=false;
//                       this.toastrService.error('Api not found !','HttpError');
//                   })






///////// using angular fire auth for signUp (Not creating user from admin panel)
      this.afAuth.auth.createUserWithEmailAndPassword(this.registerForm.controls.abc.value, this.registerForm.controls.def.value)
      .then((result) => {
        this.toastrService.success('User created successfully!', 'Success');
        let body=
        { 
          firstName:this.registerForm.controls.firstName.value,
          lastName:this.registerForm.controls.lastName.value,
          email:this.registerForm.controls.abc.value,
          phone:this.registerForm.controls.phone.value,
          role: this.registerForm.controls.role.value,
          isActive: true
        }
        this.firestore.collection('users/').doc(result.user.uid).set(body).then(()=>{
          this.toastrService.success('Role assigned successfully !', 'Success');
        })
        this.loading=false;
        this.closeModal();   
        console.log(result);
      }).catch((error) => {
        this.loading=false;
        this.toastrService.error(error.message,'Error');
      })    


  }

  closeModal() {
    this.dialog.closeAll();
  }

  trimming_fn(x) {    
    return x ? x.replace(/\s/g,'') : '';    
}; 

trimSpace(){
  this.registerForm.controls.abc.setValue(this.trimming_fn(this.registerForm.value.abc).toLowerCase());
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