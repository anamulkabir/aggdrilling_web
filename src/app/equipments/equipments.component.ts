import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { EquipmentFormModalComponent } from 'app/modals/equipment-form-modal/equipment-form-modal.component';

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.scss']
})
export class EquipmentsComponent implements OnInit {
  public equipmentList;
  p=1;
  termEquipment;
  total;
  constructor(private firestore:AngularFirestore,public dialog: MatDialog,private toastrService: ToastrService){}

  ngOnInit() {
    this.firestore.collection('equipments').snapshotChanges().subscribe(data => {
      this.equipmentList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.equipmentList',this.equipmentList);
    });
  }
  openDialog(item?) {
    this.dialog.open(EquipmentFormModalComponent, {
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
        this.firestore.doc('equipments/' + item.id).delete();
        Swal.fire(
          'Deleted!',
          'Record has been deleted.',
          'success'
        )
      }
    })
  }

}