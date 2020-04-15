import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-worksheet-msg-form-modal',
  templateUrl: './worksheet-msg-form-modal.component.html',
  styleUrls: ['./worksheet-msg-form-modal.component.scss'],
  providers: [DatePipe]
})

export class WorksheetMsgFormModalComponent implements OnInit {
  
  public userRole=localStorage.getItem('role');
  public nextStages;
  public appConfig;
  registerForm: FormGroup;
  submitted = false;

  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public datePipe : DatePipe,public dialogRef: MatDialogRef<WorksheetMsgFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }
  
  ngOnInit() { 
    
    this.firestore.collection('appConfig').snapshotChanges().subscribe(data => {
      this.appConfig = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      this.getDescription(null);
    })
   
    this.registerForm = this.formBuilder.group({
        id: [],
        entryBy: [],
        entryDate: [],
        status: ['', Validators.required],
        comment: []
    });
    this.firestore.collection('projects/'+this.data.projectId+'/workSheetStages',ref=>ref.where('name','==',this.data.worksheetStatus)).snapshotChanges().subscribe(data => {
      let project_workSheetStages=[];
      project_workSheetStages= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      let nextStages=[];
      for (let i = 0; i < project_workSheetStages[0].nextStages.length; i++) {
         nextStages.push(project_workSheetStages[0].nextStages[i]);
        }
        this.nextStages=nextStages;
      console.log('this.nextStages',this.nextStages)
      })
    this.firestore.collection('users/',ref=>ref.where('email','==',this.afAuth.auth.currentUser.email)).snapshotChanges().subscribe(data => {
      let user_info=[];
      user_info= data.map(e => {
         return {
           id: e.payload.doc.id,
           ...e.payload.doc.data() as object
         } 
       })
       console.log('this.user_info', user_info[0]);
    this.registerForm.controls.entryBy.setValue(user_info[0]);
     })
        this.registerForm.controls.entryDate.setValue(new Date());
  }


  get f() { return this.registerForm.controls; }

  getDescription(item){
    for (let i = 0; i < this.appConfig[0].stageNames.length; i++) {
      if (this.appConfig[0].stageNames[i].name==item) {
        return this.appConfig[0].stageNames[i].description;
        }
    }
  }
  
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }    
        let statusBody=
        { 
          entryBy: this.registerForm.controls.entryBy.value,
          entryDate: this.datePipe.transform(this.registerForm.controls.entryDate.value, 'yyyy-MM-dd hh:mm:ss a'),
          status: this.registerForm.controls.status.value
        }
        console.log(statusBody);
        let msgBody=
        { 
          entryBy: this.registerForm.controls.entryBy.value,
          entryDate: this.datePipe.transform(this.registerForm.controls.entryDate.value, 'yyyy-MM-dd hh:mm:ss a'),
          comment: this.registerForm.controls.comment.value
        }
        console.log(msgBody);
     this.firestore.collection('projects/'+this.data.projectId+'/worksheet').doc(this.data.worksheetId).update({currentStatus: this.registerForm.controls.status.value}).then(()=>{
        }).catch((error) => {
          this.toastrService.error(error.message);
        })
        this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/status').add(statusBody).then(()=>{
        }).catch((error) => {
          this.toastrService.error(error.message);
        })
        if (this.registerForm.controls.comment.value) {
          this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/msg').add(msgBody).then(()=>{
              }).catch((error) => {
                this.toastrService.error(error.message);
        }) 
        }
        
      this.toastrService.success('Worksheet submitted successfully !', 'Success');
      this.closeModal();     
            
  }

  closeModal() {
    this.dialog.closeAll();
  }

  closeModal2() {
    this.dialogRef.close();
  }

}
