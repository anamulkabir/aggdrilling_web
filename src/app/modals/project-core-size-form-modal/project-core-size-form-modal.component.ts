import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-project-core-size-form-modal',
  templateUrl: './project-core-size-form-modal.component.html',
  styleUrls: ['./project-core-size-form-modal.component.scss']
})
export class ProjectCoreSizeFormModalComponent implements OnInit {
  
  public coreSizesList;
  public project_core_sizes;
  registerForm: FormGroup;
  submitted = false;
  public filteredList: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  private _onDestroy = new Subject<void>();
  public listFilterCtrl: FormControl = new FormControl();
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<ProjectCoreSizeFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
    this.firestore.collection('projects/'+this.data.projectId+'/coreSizes').snapshotChanges().subscribe(data => {
      this.project_core_sizes= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.project_core_sizes',this.project_core_sizes);
    });

    this.firestore.collection('coreSizes').snapshotChanges().subscribe(data => {
      let coreSizes= data.map(e => {
        return {
         id: e.payload.doc.id,
         ...e.payload.doc.data() as object
        } 
      })
      for( var i=coreSizes.length - 1; i>=0; i--){
        for( var j=0; j<this.project_core_sizes.length; j++){
            if(coreSizes[i] && (coreSizes[i].id === this.project_core_sizes[j].coreSizeId)){
              coreSizes.splice(i, 1);
            }
        }
    }
    this.coreSizesList=coreSizes;
    console.log('this.coreSizesList',this.coreSizesList);
    
  
     this.filteredList.next(this.coreSizesList.slice());
        this.listFilterCtrl.valueChanges
           .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterList();
           });
    });

    this.registerForm = this.formBuilder.group({
        id: [],
        coreSizeId: ['', Validators.required]
    });
      if (this.data.item!==undefined) {
        this.registerForm.controls.id.setValue(this.data.item.id);
        this.registerForm.controls.coreSizeId.setValue(this.data.item);
      }
  }

  get f() { return this.registerForm.controls; }

  private filterList() {
    if (!this.coreSizesList) {
      return;
    }
    let search = this.listFilterCtrl.value;
    if (!search) {
      this.filteredList.next(this.coreSizesList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredList.next(
      this.coreSizesList.filter(bank => bank.size.toLowerCase().indexOf(search) > -1 )
     
    );
}


  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }    
        

  if (this.registerForm.value.id==null) {
    for (let i = 0; i < this.registerForm.value.coreSizeId.length; i++) {
      let body=
      { 
        coreSizeId: this.registerForm.value.coreSizeId[i].id,
        core:this.registerForm.value.coreSizeId[i].core,
        size: this.registerForm.value.coreSizeId[i].size,
        hole: this.registerForm.value.coreSizeId[i].hole
      }
      console.log(body);
        this.firestore.collection('projects/'+this.data.projectId+'/coreSizes').add(body).then(()=>{
          this.toastrService.success('Record added successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        })         
    }
  }
    else {     
      let body=
        { 
          coreSizeId: this.registerForm.value.coreSizeId.id,
          core:this.registerForm.value.coreSizeId.core,
          size: this.registerForm.value.coreSizeId.size,
          hole: this.registerForm.value.coreSizeId.hole
        }
        console.log(body);
      this.firestore.collection('projects/'+this.data.projectId+'/coreSizes').doc(this.registerForm.value.id).update(body).then(()=>{
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
