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
  public project_holes;
  registerForm: FormGroup;
  submitted = false;
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<ProjectHolesFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
    
    this.firestore.collection('projects/'+this.data.projectId+'/holes').snapshotChanges().subscribe(data => {
      let holeList=[];
      holeList = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      this.project_holes=[];
      
      if(holeList.length!=0){
      for (let i = 0; i < holeList[0].holes.length; i++) {
        this.project_holes.push(holeList[0].holes[i]);
      }
    }
      console.log('this.project_holes',this.project_holes);
      if (this.data.item!==undefined) {
        console.log('this.data.item',this.data.item);
        // console.log('this.project_holes[i]',this.project_holes[this.data.item]);
        this.registerForm.controls.name.setValue(this.project_holes[this.data.item]);
      }
    });
      this.registerForm = this.formBuilder.group({
        id: [],
        name: ['', Validators.required]
    });
     
  }

  get f() { return this.registerForm.controls; }


  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }    

    if (this.data.item!==undefined) {
    this.project_holes.splice(this.data.item, 1, this.registerForm.controls.name.value);
        let body=
        { 
          holes: this.project_holes
        }
        console.log(body);

        this.firestore.collection('projects/'+this.data.projectId+'/holes').doc('holes').update(body).then(()=>{
          this.toastrService.success('Record updated successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        }) 
      }
      else{
        
        this.project_holes.push(this.registerForm.controls.name.value);
        let body=
        { 
          holes: this.project_holes
        }
        console.log(body);
        
        this.firestore.collection('projects/'+this.data.projectId+'/holes').doc('holes').set(body).then(()=>{
          this.toastrService.success('Record saved successfully !', 'Success');
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
