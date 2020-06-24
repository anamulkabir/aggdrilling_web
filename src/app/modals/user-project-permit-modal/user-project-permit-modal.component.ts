import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from "sweetalert2";
@Component({
  selector: 'app-user-project-permit-modal',
  templateUrl: './user-project-permit-modal.component.html',
  styleUrls: ['./user-project-permit-modal.component.scss']
})
export class UserProjectPermitFormModalComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  submitted = false;
  public projectList;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  public stages;
  public appConfig;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public filteredList: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  private _onDestroy = new Subject<void>();
  public listFilterCtrl: FormControl = new FormControl();
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public dialogRef: MatDialogRef<UserProjectPermitFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

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

    this.firestore.collection('projects').snapshotChanges().subscribe(data => {
      this.projectList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })

      console.log('this.projectList : ',this.projectList)
      
      this.stages=['enableOP','enableHQ','enableGO'];

      this.filteredList.next(this.projectList.slice());
      this.listFilterCtrl.valueChanges
         .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterList();
         });
  });

  this.registerForm = this.formBuilder.group({
    id: [],
    project: ['', Validators.required],
    permitSteps: ['', Validators.required]
});
    if (this.data.item!==undefined) {
      console.log(this.data.item)
      this.registerForm.controls.id.setValue(this.data.item.id);
      this.registerForm.controls.project.setValue(this.data.item.project);
      this.registerForm.controls.permitSteps.setValue(this.data.item.permitSteps);
    }

  }

  get f() { return this.registerForm.controls; }

  
  private filterList() {
    if (!this.projectList) {
      return;
    }
    let search = this.listFilterCtrl.value;
    if (!search) {
      this.filteredList.next(this.projectList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredList.next(
      this.projectList.filter(bank => bank.projectCode.toLowerCase().indexOf(search) > -1 )
     
    );
}

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
          project: this.registerForm.value.project,
          permitSteps:this.registerForm.value.permitSteps,
          isActive:true
        }
        console.log(body);
        if (this.registerForm.value.id==null) {
        this.firestore.collection('users/'+this.data.userId+'/permitProjects').add(body).then(()=>{
        this.toastrService.success('Record added successfully !', 'Success');
      }).catch((error) => {
        this.toastrService.error(error.message);
      }) 
    }
      else {     
        this.firestore.collection('users/'+this.data.userId+'/permitProjects').doc(this.registerForm.value.id).update(body).then(()=>{
          this.toastrService.success('Record updated successfully !', 'Success');
          console.log(this.registerForm.value.id);
        }).catch((error) => {
          this.toastrService.error(error.message);
        }) 
      }
      
      this.closeModal();
  }

  closeModal() {
    this.dialog.closeAll();
  }

  deleteProjectPermit(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.firestore.doc('users/'+this.data.userId+'/permitProjects/'+ this.registerForm.value.id).delete().catch((error) => {
          this.toastrService.error(error.message);
        })
        Swal.fire(
            'Deleted!',
            'Record has been deleted.',
            'success'
        )
      }
    })
    this.closeModal();
  }

  ngOnDestroy() {
    this._onDestroy.next();
   this._onDestroy.complete();
  }
 
}
