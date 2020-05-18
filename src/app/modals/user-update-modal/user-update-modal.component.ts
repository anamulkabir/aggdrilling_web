import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";

@Component({
  selector: 'app-user-update-modal',
  templateUrl: './user-update-modal.component.html',
  styleUrls: ['./user-update-modal.component.scss']
})
export class UserUpdateModalComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,
    private firestore:AngularFirestore,public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<UserUpdateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() { 
    this.registerForm = this.formBuilder.group({
    id: [],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', Validators.required],
    role: ['', Validators.required]
});
  if (this.data.item!=undefined) {
      this.registerForm.controls.id.setValue(this.data.item.id);
      this.registerForm.controls.firstName.setValue(this.data.item.firstName);
      this.registerForm.controls.lastName.setValue(this.data.item.lastName);
      this.registerForm.controls.phone.setValue(this.data.item.phone);
      this.registerForm.controls.role.setValue(this.data.item.role);
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
          phone:this.registerForm.controls.phone.value,
          role: this.registerForm.controls.role.value
        }
        this.firestore.collection('users/').doc(this.registerForm.value.id).update(body).then(()=>{
          this.toastrService.success('Record updated successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        }) 
        this.closeModal();     
  }

    delete(item){
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            focusCancel: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                this.firestore.doc('users/' + item.id).delete();
                Swal.fire(
                    'Deleted!',
                    'User has been deleted.',
                    'success'
                )
                this.dialog.closeAll();
            }
        })
    }

  closeModal() {
    this.dialog.closeAll();
  }

}
