import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RigsFormModalComponent } from 'app/modals/rigs-form-modal/rigs-form-modal.component';

@Component({
  selector: 'app-rigs',
  templateUrl: './rigs.component.html',
  styleUrls: ['./rigs.component.scss']
})
export class RigsComponent implements OnInit {
  public rigsList;
  p=1;
  termRigs;
  total;
  constructor(private firestore:AngularFirestore,public dialog: MatDialog,private toastrService: ToastrService){}

  ngOnInit() {
    this.firestore.collection('rigs').snapshotChanges().subscribe(data => {
      this.rigsList= data.map(e => {
        return {
          id: e.payload.doc.id,serial:name,
          ...e.payload.doc.data() as object
        } 
      }).sort((a,b)=> (a.serial > b.serial ? 1 : -1))
      console.log('this.rigsList',this.rigsList);
    });
  }
  openDialog(item?) {
    this.dialog.open(RigsFormModalComponent, {
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
        this.firestore.doc('rigs/' + item.id).delete();
        Swal.fire(
          'Deleted!',
          'Record has been deleted.',
          'success'
        )
      }
    })
  }

}
