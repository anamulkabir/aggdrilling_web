import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-form-modal',
  templateUrl: './project-form-modal.component.html',
  styleUrls: ['./project-form-modal.component.scss'],
  providers: [DatePipe]
})
export class ProjectFormModalComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,
    private firestore:AngularFirestore,public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<ProjectFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,public datePipe : DatePipe) {

   
  }

  ngOnInit() { 
    this.registerForm = this.formBuilder.group({
    id:[],
    entryDate: [],
    projectCode: ['', Validators.required],
    projectName: ['', Validators.required],
    startDate: ['', Validators.required],
    status: ['', Validators.required]
});

this.registerForm.controls.status.setValue('live');
this.registerForm.controls.entryDate.setValue(new Date());
if (this.data.item!==undefined) {
  this.registerForm.controls.id.setValue(this.data.item.id);
  this.registerForm.controls.projectName.setValue(this.data.item.projectName);
  this.registerForm.controls.projectCode.setValue(this.data.item.projectCode);  
  this.registerForm.controls.entryDate.setValue(new Date(this.data.item.entryDate));
  this.registerForm.controls.startDate.setValue(new Date(this.data.item.startDate));
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
      projectName:this.registerForm.controls.projectName.value,
      projectCode:this.registerForm.controls.projectCode.value,
      entryDate: this.datePipe.transform(this.registerForm.controls.entryDate.value, 'yyyy-MM-dd'),
      startDate: this.datePipe.transform(this.registerForm.controls.startDate.value, 'yyyy-MM-dd'),
      status: this.registerForm.controls.status.value
    }
        console.log(body);

  if (this.registerForm.value.id==null) {
        this.firestore.collection('projects/').add(body).then((docRef)=>{
        this.toastrService.success('Project created successfully !', 'Success');
          
        this.firestore.firestore.collection('projectSteps').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.data());
         this.firestore.collection('projects/'+docRef.id+'/workSheetStages').add(doc.data()).then(()=>{
            this.toastrService.success('Worksheet stages added successfully !', 'Success');
          }).catch((error) => {
            this.toastrService.error(error.message);
          }) 
          });
        })
    .catch(err => {
      console.log('Error getting documents', err);
  });
        

      }).catch((error) => {
        this.toastrService.error(error.message);
      })
                 
    }
    else {     
      this.firestore.collection('projects/').doc(this.registerForm.value.id).update(body).then(()=>{
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
