import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { delay, take, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-project-worker-form-modal',
  templateUrl: './project-worker-form-modal.component.html',
  styleUrls: ['./project-worker-form-modal.component.scss']
})

export class ProjectWorkerFormModalComponent implements OnInit, OnDestroy {
  
  public workersList;
  public project_worker;
  registerForm: FormGroup;
  submitted = false;
  public filteredList: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  private _onDestroy = new Subject<void>();
  public listFilterCtrl: FormControl = new FormControl();
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<ProjectWorkerFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }
    
  
  ngOnInit() { 
    this.firestore.collection('projects/'+this.data.projectId+'/workers').snapshotChanges().subscribe(data => {
      this.project_worker= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.project_worker',this.project_worker);
    });

      this.firestore.collection('workers').snapshotChanges().subscribe(data => {
      let workers= data.map(e => {
        return {
         id: e.payload.doc.id,lastName:name,
         ...e.payload.doc.data() as object
        } 
      }).sort((a,b)=> (a.lastName > b.lastName ? 1 : -1))

      for( var i=workers.length - 1; i>=0; i--){
        for( var j=0; j<this.project_worker.length; j++){
            if(workers[i] && (workers[i].id === this.project_worker[j].workerId)){
              workers.splice(i, 1);
            }
        }
    }
    
    this.workersList=workers;
     console.log('this.workersList',this.workersList);
    

     this.filteredList.next(this.workersList.slice());
        this.listFilterCtrl.valueChanges
           .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterList();
           });
    });

    this.registerForm = this.formBuilder.group({
        id: [],
        workerId: ['', Validators.required]
    });
    
      if (this.data.item!==undefined) {
        this.registerForm.controls.id.setValue(this.data.item.id);
        this.registerForm.controls.workerId.setValue(this.data.item);
      }
  }
  private filterList() {
         if (!this.workersList) {
           return;
         }
         let search = this.listFilterCtrl.value;
         if (!search) {
           this.filteredList.next(this.workersList.slice());
           return;
         } else {
           search = search.toLowerCase();
         }
         this.filteredList.next(
           this.workersList.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1 || bank.lastName.toLowerCase().indexOf(search) > -1)
          
         );
  }


  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }    
        
    if (this.registerForm.value.id==null) {
        for (let i = 0; i < this.registerForm.value.workerId.length; i++) {
          let body=
          { 
            workerId: this.registerForm.value.workerId[i].id,
            firstName:this.registerForm.value.workerId[i].firstName,
            lastName:this.registerForm.value.workerId[i].lastName,
            skills:this.registerForm.value.workerId[i].skills,
            designation: this.registerForm.value.workerId[i].designation,
            type: this.registerForm.value.workerId[i].type
          }
          console.log(body);
            
        this.firestore.collection('projects/'+this.data.projectId+'/workers').add(body).then(()=>{
          this.toastrService.success('Record added successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        })   
      }      
    }
    else {     
      let body=
      { 
        workerId: this.registerForm.value.workerId.id,
        firstName:this.registerForm.value.workerId.firstName,
        lastName:this.registerForm.value.workerId.lastName,
        skills:this.registerForm.value.workerId.skills,
        designation: this.registerForm.value.workerId.designation,
        type: this.registerForm.value.workerId.type
      }
      console.log(body);
      this.firestore.collection('projects/'+this.data.projectId+'/workers').doc(this.registerForm.value.id).update(body).then(()=>{
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
