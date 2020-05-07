import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {MaterialsFormModalComponent} from 'app/modals/materials-form-modal/materials-form-modal.component';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {
  public materialList;
  public unitDefinitionList;
  p=1;
  termMaterial;
  total;
  constructor(private firestore:AngularFirestore,public dialog: MatDialog,private toastrService: ToastrService){}

  ngOnInit() {
    this.firestore.collection('materials').snapshotChanges().subscribe(data => {
      this.materialList= data.map(e => {
        return {
          id: e.payload.doc.id, name: name,
          ...e.payload.doc.data() as object
        }
      }).sort((a,b)=> (a.name > b.name? 1 : -1))

      console.log('this.materialList',this.materialList);
    });
    this.firestore.collection('unitDefinition').snapshotChanges().subscribe(data => {
      this.unitDefinitionList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })


      console.log('this.unitDefinitionList',this.unitDefinitionList);
    });
  }
  
  paginationStart(){
    this.p=1;
  }
  openDialog(item?) {
    this.dialog.open(MaterialsFormModalComponent, {
      data: {
        item: item
      },
      position:{
        top:'50px'
      }
    });
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
        this.firestore.doc('materials/' + item.id).delete();
        Swal.fire(
          'Deleted!',
          'Record has been deleted.',
          'success'
        )
      }
    })
  }

}
