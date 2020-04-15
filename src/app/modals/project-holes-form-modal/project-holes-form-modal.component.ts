import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-holes-form-modal',
  templateUrl: './project-holes-form-modal.component.html',
  styleUrls: ['./project-holes-form-modal.component.scss']
})
export class ProjectHolesFormModalComponent implements OnInit {
  
  public workersList;
  registerForm: FormGroup;
  submitted = false;
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<ProjectHolesFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
      this.registerForm = this.formBuilder.group({
        id: [],
        code: ['', Validators.required],
        name: ['', Validators.required]
    });
      if (this.data.item!==undefined) {
        this.registerForm.controls.id.setValue(this.data.item.id);
        this.registerForm.controls.code.setValue(this.data.item.code);
        this.registerForm.controls.name.setValue(this.data.item.name);
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
          code: this.registerForm.controls.code.value,
          name: this.registerForm.controls.name.value
        }
        console.log(this.data.projectId,this.registerForm.controls.id.value,body);

  if (this.registerForm.value.id==null) {
        this.firestore.collection('projects/'+this.data.projectId+'/holes').add(body).then(()=>{
          this.toastrService.success('Record added successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        })         
    }
    else {     
      this.firestore.collection('projects/'+this.data.projectId+'/holes').doc(this.registerForm.controls.id.value).update(body).then(()=>{
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
