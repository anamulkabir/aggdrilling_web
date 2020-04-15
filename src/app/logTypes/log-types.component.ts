import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { LogTypeFormModalComponent } from 'app/modals/log-type-form-modal/log-type-form-modal.component';

@Component({
  selector: 'app-log-types',
  templateUrl: './log-types.component.html',
  styleUrls: ['./log-types.component.scss']
})
export class LogTypesComponent implements OnInit {
  public logTypesList;
  public types;
  p=1;
  termLogType;
  total;
  constructor(private firestore:AngularFirestore,public dialog: MatDialog,private toastrService: ToastrService){}

  ngOnInit() {
    this.firestore.collection('logTypes').snapshotChanges().subscribe(data => {
      this.logTypesList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      this.types=[];
      for (let i = 0; i < this.logTypesList[0].types.length; i++) {
        this.types.push({'name':this.logTypesList[0].types[i]});
      }
      console.log('types : ',this.types)
    });
  }
  paginationStart(){
    this.p=1;
  }
  openDialog(item?) {
    this.dialog.open(LogTypeFormModalComponent, {
      data: {
        item: item
      },
      position:{
        top:'50px'
      }
    });
   }


}
