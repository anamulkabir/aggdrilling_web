import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project-geo-form-modal',
  templateUrl: './project-geo-form-modal.component.html',
  styleUrls: ['./project-geo-form-modal.component.scss']
})
export class ProjectGeoFormModalComponent implements OnInit, OnDestroy {
  public geologistList;
  public project_geologist;
  public project_geologist_status_query;
  registerForm: FormGroup;
  submitted = false;
  public filteredList: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  private _onDestroy = new Subject<void>();
  public listFilterCtrl: FormControl = new FormControl();
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<ProjectGeoFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
       
    this.firestore.collection('projects/'+this.data.projectId+'/geologists').snapshotChanges().subscribe(data => {
      this.project_geologist= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.project_geologist',this.project_geologist);
    });

    this.firestore.collection('geologists').snapshotChanges().subscribe(data => {
      let geologist= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })

        for( var i=geologist.length - 1; i>=0; i--){
          for( var j=0; j<this.project_geologist.length; j++){
              if(geologist[i] && (geologist[i].id === this.project_geologist[j].geologistId)){
                geologist.splice(i, 1);
              }
          }
      }
      
      this.geologistList=geologist;
      console.log('this.geologistList',this.geologistList);
        
     this.filteredList.next(this.geologistList.slice());
        this.listFilterCtrl.valueChanges
           .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterList();
           });
    });

    this.firestore.collection('projects/'+this.data.projectId+'/geologists', ref => ref.where('isActive','==',true)).snapshotChanges().subscribe(data => {
      this.project_geologist_status_query= data.map(e => {
        return {
         id: e.payload.doc.id,
         ...e.payload.doc.data() as object
        }
      })
     console.log('this.project_geologist_status_query',this.project_geologist_status_query);
    });

    this.registerForm = this.formBuilder.group({
        id: [],
        geologistId: ['', Validators.required]
    });
  }

  get f() { return this.registerForm.controls; }

  private filterList() {
    if (!this.geologistList) {
      return;
    }
    let search = this.listFilterCtrl.value;
    if (!search) {
      this.filteredList.next(this.geologistList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredList.next(
      this.geologistList.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1 || bank.lastName.toLowerCase().indexOf(search) > -1)
    );
}
 
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }    
        let body=
        { 
          geologistId: this.registerForm.value.geologistId.id,
          firstName:this.registerForm.value.geologistId.firstName,
          lastName:this.registerForm.value.geologistId.lastName,
          email:this.registerForm.value.geologistId.email,
          phone:this.registerForm.value.geologistId.phone,
          companyName:this.registerForm.value.geologistId.companyName,
          emergencyContactName:this.registerForm.value.geologistId.emergencyContactName,
          emergencyContactPhone:this.registerForm.value.geologistId.emergencyContactPhone,
          isActive:true
        }
        console.log(body);

  if (this.registerForm.value.id==null) {
    if (this.project_geologist_status_query.length==0) {
      this.firestore.collection('projects/'+this.data.projectId+'/geologists').add(body).then(()=>{
          this.toastrService.success('Record added successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        })  
      }
      else{
        this.toastrService.error('You can add only one geologist in a project !','Error');
      }       
    }
    else {     
      this.firestore.collection('project_geologist/').doc(this.registerForm.value.id).update(body).then(()=>{
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
