import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project-rigs-form-modal',
  templateUrl: './project-rigs-form-modal.component.html',
  styleUrls: ['./project-rigs-form-modal.component.scss']
})
export class ProjectRigsFormModalComponent implements OnInit {
  
  public rigsList;
  public project_rigs;
  registerForm: FormGroup;
  submitted = false;
  public filteredList: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  private _onDestroy = new Subject<void>();
  public listFilterCtrl: FormControl = new FormControl();
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<ProjectRigsFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
  
    this.firestore.collection('projects/'+this.data.projectId+'/rigs').snapshotChanges().subscribe(data => {
      this.project_rigs= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.project_rigs',this.project_rigs);
    });

    this.firestore.collection('rigs', ref => ref.where('status','==','free')).snapshotChanges().subscribe(data => {
      let rigs= data.map(e => {
        return {
         id: e.payload.doc.id,
         ...e.payload.doc.data() as object
        } 
      })
      for( var i=rigs.length - 1; i>=0; i--){
        for( var j=0; j<this.project_rigs.length; j++){
            if(rigs[i] && (rigs[i].id === this.project_rigs[j].rigsId)){
              rigs.splice(i, 1);
            }
        }
    }
    this.rigsList=rigs;
    console.log('this.rigsList',this.rigsList);
    
  
     this.filteredList.next(this.rigsList.slice());
        this.listFilterCtrl.valueChanges
           .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterList();
           });
    });
    this.registerForm = this.formBuilder.group({
        id: [],
        rigsId: ['', Validators.required]
        // ,status: ['', Validators.required]
    });
      if (this.data.item!==undefined) {
        this.registerForm.controls.id.setValue(this.data.item.id);
        this.registerForm.controls.rigsId.setValue(this.data.item);
      }
  }

  get f() { return this.registerForm.controls; }

  private filterList() {
    if (!this.rigsList) {
      return;
    }
    let search = this.listFilterCtrl.value;
    if (!search) {
      this.filteredList.next(this.rigsList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredList.next(
      this.rigsList.filter(bank => bank.serial.toLowerCase().indexOf(search) > -1 )
     
    );
}
  
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }    
        

  if (this.registerForm.value.id==null) {
    for (let i = 0; i < this.registerForm.value.rigsId.length; i++) {
      let body=
      { 
        rigsId: this.registerForm.value.rigsId[i].id,
        rid:this.registerForm.value.rigsId[i].rid,
        serial: this.registerForm.value.rigsId[i].serial,
        status: this.registerForm.value.rigsId[i].status,
        isActive:true
      }
      console.log(body);
        this.firestore.collection('projects/'+this.data.projectId+'/rigs').add(body).then(()=>{
          this.toastrService.success('Record added successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        })         
    }
  }
    else {   
      let body=
        { 
          rigsId: this.registerForm.value.rigsId.id,
          rid:this.registerForm.value.rigsId.rid,
          serial: this.registerForm.value.rigsId.serial,
          status: this.registerForm.value.rigsId.status,
          isActive:true
        }
        console.log(body);  
      this.firestore.collection('projects/'+this.data.projectId+'/rigs').doc(this.registerForm.value.id).update(body).then(()=>{
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

  ngOnDestroy() {
    this._onDestroy.next();
   this._onDestroy.complete();
  }
  
}
