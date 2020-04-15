import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-coresize-form-modal',
  templateUrl: './coresize-form-modal.component.html',
  styleUrls: ['./coresize-form-modal.component.scss']
})
export class CoresizeFormModalComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public dialogRef: MatDialogRef<CoresizeFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
    this.registerForm = this.formBuilder.group({
        id: [],
        core: ['', Validators.required],
        size: ['', Validators.required],
        hole: ['', Validators.required]
    });
    if (this.data.item!==undefined) {
      this.registerForm.controls.id.setValue(this.data.item.id);
      this.registerForm.controls.core.setValue(this.data.item.core);
      this.registerForm.controls.size.setValue(this.data.item.size);
      this.registerForm.controls.hole.setValue(this.data.item.hole);
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
          core:this.registerForm.controls.core.value,
          size: this.registerForm.controls.size.value,
          hole: this.registerForm.controls.hole.value
        }
        console.log(body);

  if (this.registerForm.value.id==null) {
        this.firestore.collection('coreSizes/').add(body).then(()=>{
          this.toastrService.success('Core record added successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        })         
    }
    else {     
      this.firestore.collection('coreSizes/').doc(this.registerForm.value.id).update(body).then(()=>{
        this.toastrService.success('Core record updated successfully !', 'Success');
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
