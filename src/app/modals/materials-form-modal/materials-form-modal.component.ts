import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-materials-form-modal',
  templateUrl: './materials-form-modal.component.html',
  styleUrls: ['./materials-form-modal.component.scss']
})
export class MaterialsFormModalComponent implements OnInit {
  public unitDefinitionList;
  registerForm: FormGroup;
  submitted = false;
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public dialogRef: MatDialogRef<MaterialsFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { 
    
  this.firestore.firestore.collection('unitDefinition').where('status','==',true).get()
   .then(snapshot => {
     if (snapshot.empty) {
      this.toastrService.error('There is no unit definition in database');
       return;
     }  
 let data=[];
     snapshot.forEach(doc => {
      data.push({id:doc.id,title:doc.data().title,status:doc.data().status})
     });
     this.unitDefinitionList=data;
     console.log('this.unitDefinitionList',this.unitDefinitionList);
   })
   .catch(err => {
     this.toastrService.error(err,'Error getting documents');
   });

  
    this.registerForm = this.formBuilder.group({
        id: [],
        refKey: ['', Validators.required],
        name: ['', Validators.required],
        details: [],
        unit: [],
        unitPrice: ['', Validators.required]
    });
    if (this.data.item!==undefined) {
      this.registerForm.controls.id.setValue(this.data.item.id);
      this.registerForm.controls.refKey.setValue(this.data.item.refKey);
      this.registerForm.controls.name.setValue(this.data.item.name);
      this.registerForm.controls.details.setValue(this.data.item.details);
      this.registerForm.controls.unit.setValue(this.data.item.unit);
      this.registerForm.controls.unitPrice.setValue(this.data.item.unitPrice);
    }
    
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }    
        let body=
        { 
          refKey: this.registerForm.controls.refKey.value,
          name:this.registerForm.controls.name.value,
          details: this.registerForm.controls.details.value,
          unit: this.registerForm.controls.unit.value,
          unitPrice: this.registerForm.controls.unitPrice.value
        }
        console.log(body);

  if (this.registerForm.value.id==null) {
        this.firestore.collection('materials/').add(body).then(()=>{
          this.toastrService.success('Record added successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        })         
    }
    else {     
      this.firestore.collection('materials/').doc(this.registerForm.value.id).update(body).then(()=>{
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
