import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CoresizeFormModalComponent } from 'app/modals/coresize-form-modal/coresize-form-modal.component';

@Component({
  selector: 'app-core-sizes',
  templateUrl: './core-sizes.component.html',
  styleUrls: ['./core-sizes.component.scss']
})
export class CoreSizesComponent implements OnInit {
  public coresizeList;
  p=1;
  termCoresize;
  total;
  constructor(private firestore:AngularFirestore,public dialog: MatDialog,private toastrService: ToastrService){}

  ngOnInit() {
    this.firestore.collection('coreSizes').snapshotChanges().subscribe(data => {
      this.coresizeList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.coresizeList',this.coresizeList);
    });
  }
  openDialog(item?) {
    this.dialog.open(CoresizeFormModalComponent, {
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
        this.firestore.doc('coreSizes/' + item.id).delete();
        Swal.fire(
          'Deleted!',
          'Record has been deleted.',
          'success'
        )
      }
    })
  }

}