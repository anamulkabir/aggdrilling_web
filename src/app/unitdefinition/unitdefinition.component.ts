import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { UnitdefinitionFormModalComponent } from 'app/modals/unitdefinition-form-modal/unitdefinition-form-modal.component';

@Component({
  selector: 'app-unitdefinition',
  templateUrl: './unitdefinition.component.html',
  styleUrls: ['./unitdefinition.component.scss']
})
export class UnitdefinitionComponent implements OnInit {
  public unitDefinitionList;
  p=1;
  termUnitDefinition;
  total;
  constructor(private firestore:AngularFirestore,public dialog: MatDialog,private toastrService: ToastrService){}

  ngOnInit() {
    this.firestore.collection('unitDefinition', ref => ref.orderBy('title')).snapshotChanges().subscribe(data => {
      this.unitDefinitionList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.unitDefinitionList',this.unitDefinitionList);
    });
  }
  openDialog(item?) {
    this.dialog.open(UnitdefinitionFormModalComponent, {
      data: {
        item: item
      },
      position:{
        top:'50px'
      }
    });
   }
   paginationStart(){
    this.p=1;
  }
   
statusToogoleChangeForUnitDefinition(item,e) {
    
  if(e.checked){
    let body={
      status: true
    }
    this.firestore.collection('unitDefinition/').doc(item.id).update(body).then(()=>{
      this.toastrService.success('Record updated successfully !', 'Success');
    }).catch((error) => {
      this.toastrService.error(error.message);
    }) 
  
 
  }
  else{
    let body={
      status: false
    }
    this.firestore.collection('unitDefinition/').doc(item.id).update(body).then(()=>{
      this.toastrService.success('Record updated successfully !', 'Success');
    }).catch((error) => {
      this.toastrService.error(error.message);
    }) 
  }
}
  
   delete(item){
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
        this.firestore.doc('unitDefinition/' + item.id).delete().catch((error) => {
          this.toastrService.error(error.message);
        }) ;
        Swal.fire(
          'Deleted!',
          'Record has been deleted.',
          'success'
        )
      }
    })
  }

}
