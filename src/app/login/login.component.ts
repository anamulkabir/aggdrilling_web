import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loading=false;
  hide = true;
  registerForm: FormGroup;
  submitted = false;
  constructor(public afAuth: AngularFireAuth,private firestore:AngularFirestore, private router: Router,
    private formBuilder: FormBuilder,private toastrService: ToastrService) 
  { 
    if (localStorage.getItem('role') !== null) {  
      this.router.navigate(['projects']); 
    } 
  }  

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', Validators.required]
    })
      }

   get f() { return this.registerForm.controls; }

   onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }
    this.loading=true;
    return this.afAuth.auth.signInWithEmailAndPassword(this.registerForm.controls.email.value, this.registerForm.controls.password.value)
      .then((result) => {
        this.getLoginUserRole(result.user.uid);
      })
      .catch((error) => {
        this.toastrService.error(error.message);
        this.loading=false;
      })
  }


  getLoginUserRole(id){
    this.firestore.firestore.collection('users/').doc(id).get()
   .then( (res ) => {    
     if (res.data().isActive==false) {
    this.toastrService.error('Sorry ! Your account is disabled now !', 'Failed'); 
    this.loading=false;
     } 
     else {
    localStorage.setItem('role',res.data().role);
    localStorage.setItem('userName',res.data().firstName+' '+res.data().lastName);
    localStorage.setItem('userId',res.data().id);
    this.router.navigate(["projects"]);
    console.log('user : ',res.data());         
    this.toastrService.success('You are logged in successfully !', 'Success'); 
     }
  }).catch( (error) => { 
    this.toastrService.error(error,'Error !');
    this.loading=false;
  })
}

  dismiss() {
    this.submitted = false;
    this.registerForm.reset();
  }


  public  resetPassword() {
    Swal.mixin({
      input: 'email',
      confirmButtonText: 'Yes, send mail',
      showCancelButton: true
    }).queue([
      {
      title: 'Are you sure ?',
      text: "A mail will be sent to your email to reset your password.",
      input: 'email',
      inputPlaceholder: 'Enter your email address',
     inputValidator: (value) => {
      return new Promise((resolve) => {
        return this.afAuth.auth.sendPasswordResetEmail(value)
        .then((result) => {
          resolve();
        })
        .catch((error) => {
          resolve(error.message)
        })
      })
    }         
    }
    ]).then((result) => {
      
      if (result.value) {
              Swal.fire({
                title: 'Mail Sent',
                html: `
                Password reset email sent, check your email inbox to reset your password.
                `,
                confirmButtonText: 'Ok!'
              })
            }
          })
      }

}
