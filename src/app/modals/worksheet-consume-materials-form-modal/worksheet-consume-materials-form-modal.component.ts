import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-worksheet-consume-materials-form-modal',
  templateUrl: './worksheet-consume-materials-form-modal.component.html',
  styleUrls: ['./worksheet-consume-materials-form-modal.component.scss'],
  providers: [DatePipe]
})

export class WorksheetConsumeMaterialsFormModalComponent implements OnInit {
  public project_worksheet_consumeMaterials;
  public materialsList;
  registerForm: FormGroup;
  submitted = false;
  public filteredList: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  private _onDestroy = new Subject<void>();
  public listFilterCtrl: FormControl = new FormControl();

  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
  public afAuth: AngularFireAuth,public datePipe : DatePipe,public dialogRef: MatDialogRef<WorksheetConsumeMaterialsFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }
   
  ngOnInit() { 

    this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/consumeMaterials').snapshotChanges().subscribe(data => {
      this.project_worksheet_consumeMaterials= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.project_worksheet_consumeMaterials',this.project_worksheet_consumeMaterials);
    });

    this.firestore.collection('projects/'+this.data.projectId+'/materials').snapshotChanges().subscribe(data => {
      let material= data.map(e => {
        return {
         id: e.payload.doc.id,name:name,
         ...e.payload.doc.data() as object
        } 
      }).sort((a,b)=> (a.name > b.name ? 1 : -1))
      let materials=[];
      materials=material;

      console.log('materials',materials);
    for( var i=materials.length - 1; i>=0; i--){
      for( var j=0; j<this.project_worksheet_consumeMaterials.length; j++){
          if(materials[i] && (materials[i].materialId === this.project_worksheet_consumeMaterials[j].material.materialId)){
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
        entryBy: [],
        entryDate: [],
        material: ['', Validators.required],
        qty: ['', [Validators.required,Validators.min(1)]],
    });

    this.firestore.collection('users/',ref=>ref.where('email','==',this.afAuth.auth.currentUser.email)).snapshotChanges().subscribe(data => {
      let user_info=[];
      user_info= data.map(e => {
         return {
           id: e.payload.doc.id,
           ...e.payload.doc.data() as object
         } 
       })
       console.log('user_info', user_info[0]);
    this.registerForm.controls.entryBy.setValue(user_info[0]);
     })
     this.registerForm.controls.entryDate.setValue(new Date());
      if (this.data.item!==undefined) {
        this.registerForm.controls.id.setValue(this.data.item.id);
        this.registerForm.controls.entryBy.setValue(this.data.item.entryBy);
        this.registerForm.controls.entryDate.setValue(new Date(this.data.item.entryDate));
        this.registerForm.controls.material.setValue(this.data.item.material);
        this.registerForm.controls.qty.setValue(this.data.item.qty);
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
        let body=
        { 
          entryDate:this.datePipe.transform(this.registerForm.controls.entryDate.value, 'yyyy-MM-dd hh:mm:ss a'),
          entryBy: this.registerForm.controls.entryBy.value,
          material:{materialId:this.registerForm.controls.material.value.materialId,name:this.registerForm.controls.material.value.name},
          qty: this.registerForm.controls.qty.value
        }
        console.log(body);

  if (this.registerForm.value.id==null) {
    this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/consumeMaterials').add(body).then(()=>{
          this.toastrService.success('Record added successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        })         
    }
    else {     
      this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/consumeMaterials').doc(this.registerForm.value.id).update(body).then(()=>{
        this.toastrService.success('Record updated successfully !', 'Success');
      }).catch((error) => {
        this.toastrService.error(error.message);
      }) 
    }
    
    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }

}
