import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-worksheet-stage-form-modal',
  templateUrl: './worksheet-stage-form-modal.component.html',
  styleUrls: ['./worksheet-stage-form-modal.component.scss']
})
export class WorksheetStagesFormModalComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  public stages;
  public appConfig;
  public actionsList;
  public actionList=[];  
  public stagesList=[];
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public dialogRef: MatDialogRef<WorksheetStagesFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

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

  this.firestore.collection('actions').snapshotChanges().subscribe(data => {
    let actionsList=[];
    actionsList= data.map(e => {
      return {
        id: e.payload.doc.id,
        ...e.payload.doc.data() as object
      } 
    })
    for (let i = 0; i < actionsList[0].action.length; i++) {
      this.actionList.push(actionsList[0].action[i]);
    }
    console.log('this.actionList',this.actionList);
    this.stages=['enableOP','enableHQ','enableGO','approved'];
  });
    this.registerForm = this.formBuilder.group({
        id: [],
        name:  ['', Validators.required],
        actions:  ['', Validators.required],
        nextStages: ['', Validators.required]
    });
    if (this.data.item!==undefined) {
      this.registerForm.controls.id.setValue(this.data.item.id);
      this.registerForm.controls.name.setValue(this.data.item.name);
      this.registerForm.controls.actions.setValue(this.data.item.actions);
      this.registerForm.controls.nextStages.setValue(this.data.item.nextStages);
    }
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
        let body=
        { 
          name: this.registerForm.controls.name.value,
          actions: this.registerForm.controls.actions.value,
          nextStages: this.registerForm.controls.nextStages.value,
        }
        console.log(body);

  if (this.registerForm.value.id==null) {
        this.firestore.collection('projects/'+this.data.projectId+'/workSheetStages').add(body).then(()=>{
          this.toastrService.success('Record added successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        })         
    }
    else {     
      this.firestore.collection('projects/'+this.data.projectId+'/workSheetStages').doc(this.registerForm.value.id).update(body).then(()=>{
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
