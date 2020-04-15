import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { GeologistFormModalComponent } from 'app/modals/geologist-form-modal/geologist-form-modal.component';
import { Geo_userFormModalComponent } from 'app/modals/geo_user-form-modal/geo_user-form-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-geologists',
  templateUrl: './geologists.component.html',
  styleUrls: ['./geologists.component.scss']
})
export class GeologistsComponent implements OnInit {
  public geologistList;
  p=1;
  termGeologist;
  total;
  constructor(private firestore:AngularFirestore,public router:Router,public dialog: MatDialog,private toastrService: ToastrService){}

  ngOnInit() {
    this.firestore.collection('geologists').snapshotChanges().subscribe(data => {
      this.geologistList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.geologistList',this.geologistList);
    });
  }
  openDialog(item?) {
    this.dialog.open(GeologistFormModalComponent, {
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

   makeGeoUserDialog(item?) {
    this.dialog.open(Geo_userFormModalComponent, {
      data: {
        item: item
      },
      position:{
        top:'50px'
      }
    });
   }

   go_to_assign_project_permition(item){
    this.router.navigate(['/user/'+item]);
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
        this.firestore.doc('geologists/' + item.id).delete();
        Swal.fire(
          'Deleted!',
          'Worker has been deleted.',
          'success'
        )
      }
    })
  }

}