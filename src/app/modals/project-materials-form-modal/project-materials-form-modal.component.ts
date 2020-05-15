import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project-materials-form-modal',
  templateUrl: './project-materials-form-modal.component.html',
  styleUrls: ['./project-materials-form-modal.component.scss']
})
export class ProjectMaterialsFormModalComponent implements OnInit , OnDestroy {
  
  public materialsList;
  public project_materials;
  registerForm: FormGroup;
  submitted = false;
  public filteredList: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  private _onDestroy = new Subject<void>();
  public listFilterCtrl: FormControl = new FormControl();
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<ProjectMaterialsFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
    this.firestore.collection('projects/'+this.data.projectId+'/materials').snapshotChanges().subscribe(data => {
      this.project_materials= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.project_materials',this.project_materials);
    });

    this.firestore.collection('materials').snapshotChanges().subscribe(data => {
      let materials= data.map(e => {
        return {
         id: e.payload.doc.id, name:name,
         ...e.payload.doc.data() as object
        } 
      }).sort((a,b)=> (a.name > b.name ? 1 : -1))

    for( var i=materials.length - 1; i>=0; i--){
      for( var j=0; j<this.project_materials.length; j++){
          if(materials[i] && (materials[i].id === this.project_materials[j].materialId)){
            materials.splice(i, 1);
          }
      }
  }
  
  this.materialsList=materials;
  console.log('this.materialsList',this.materialsList);
  

   this.filteredList.next(this.materialsList.slice());
      this.listFilterCtrl.valueChanges
         .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterList();
         });
  });
    this.registerForm = this.formBuilder.group({
        id: [],
        materialId: ['', Validators.required],
        unitPrice: []
    });
      if (this.data.item!==undefined) {
        this.registerForm.controls.id.setValue(this.data.item.id);
        this.registerForm.controls.materialId.setValue(this.data.item);
        this.registerForm.controls.unitPrice.setValue(this.data.item.unitPrice);
        this.registerForm.controls.unitPrice.setValidators([Validators.required]);
      }
  }

  get f() { return this.registerForm.controls; }

  private filterList() {
    if (!this.materialsList) {
      return;
    }
    let search = this.listFilterCtrl.value;
    if (!search) {
      this.filteredList.next(this.materialsList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredList.next(
      this.materialsList.filter(bank => bank.name.toLowerCase().indexOf(search) > -1 )
     
    );
}

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }    
      

  if (this.registerForm.value.id==null) {
    for (let i = 0; i < this.registerForm.value.materialId.length; i++) {
    let body=
    { 
      materialId: this.registerForm.value.materialId[i].id,
      refKey: this.registerForm.value.materialId[i].refKey,
      name:this.registerForm.value.materialId[i].name,
      details: this.registerForm.value.materialId[i].details,
      unitPrice: this.registerForm.value.materialId[i].unitPrice
    }
    console.log(body);

        this.firestore.collection('projects/'+this.data.projectId+'/materials').add(body).then(()=>{
          this.toastrService.success('Record added successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        })         
    }
  }
    else {    
      let body=
      { 
        materialId: this.registerForm.value.materialId.id,
        refKey: this.registerForm.value.materialId.refKey,
        name:this.registerForm.value.materialId.name,
        details: this.registerForm.value.materialId.details,
        unitPrice: this.registerForm.value.unitPrice
      }
      console.log(body); 
      this.firestore.collection('projects/'+this.data.projectId+'/materials').doc(this.registerForm.value.id).update(body).then(()=>{
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
