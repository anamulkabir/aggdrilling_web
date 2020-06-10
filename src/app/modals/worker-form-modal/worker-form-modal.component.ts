import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-worker-form-modal',
  templateUrl: './worker-form-modal.component.html',
  styleUrls: ['./worker-form-modal.component.scss']
})
export class WorkerFormModalComponent implements OnInit {
  public submit_button=false;
  registerForm: FormGroup;
  submitted = false;
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<WorkerFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
    this.registerForm = this.formBuilder.group({
        id: [],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        skills:[''],
        designation: ['', Validators.required],
        type: [''],
        phone: ['', Validators.required],
        emgCntactName: ['', Validators.required],
        emgCntactPhone: ['', Validators.required]
    });
    if (this.data.item!==undefined) {
      this.registerForm.controls.id.setValue(this.data.item.id);
      this.registerForm.controls.firstName.setValue(this.data.item.firstName);
      this.registerForm.controls.lastName.setValue(this.data.item.lastName);
      this.registerForm.controls.skills.setValue(this.data.item.skills);
      this.registerForm.controls.designation.setValue(this.data.item.designation);
      this.registerForm.controls.type.setValue(this.data.item.type);
      this.registerForm.controls.phone.setValue(this.data.item.phone);
      this.registerForm.controls.emgCntactName.setValue(this.data.item.emgCntactName);
      this.registerForm.controls.emgCntactPhone.setValue(this.data.item.emgCntactPhone);
    }
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }    
    
    this.submit_button=true;
        let body=
        { 
          firstName:this.registerForm.controls.firstName.value,
          lastName:this.registerForm.controls.lastName.value,
          skills:this.registerForm.controls.skills.value,
          designation: this.registerForm.controls.designation.value,
          type: this.registerForm.controls.type.value,
          phone: this.registerForm.controls.phone.value,
          emgCntactName: this.registerForm.controls.emgCntactName.value,
          emgCntactPhone: this.registerForm.controls.emgCntactPhone.value
        }
        console.log(body);
  
        
     
  if (this.registerForm.value.id==null) {
    this.firestore.firestore.collection('workers')
    .where('firstName','==',this.registerForm.controls.firstName.value)
    .where('lastName','==',this.registerForm.controls.lastName.value)
    .get().then(snapshot => {
            if (snapshot.empty) {
              this.firestore.collection('workers/').add(body).then(()=>{
                this.toastrService.success('Record added successfully !', 'Success');
              }).catch((error) => {
                this.toastrService.error(error.message);
              }) 
              this.closeModal();
            }  
          else{
            this.toastrService.error('The worker name already exists !','Error !');
            this.submit_button=false;
              }
        })
        .catch(err => {
          this.toastrService.error(err,'Error in name searching');
          this.submit_button=false;
        });        
    }
    else {     
      this.firestore.collection('workers/').doc(this.registerForm.value.id).update(body).then(()=>{
        this.toastrService.success('Record updated successfully !', 'Success');
      }).catch((error) => {
        this.submit_button=false;
        this.toastrService.error(error.message);
      }) 
    this.closeModal();
    }
    
  }

  closeModal() {
    this.dialog.closeAll();
  }
 
}
