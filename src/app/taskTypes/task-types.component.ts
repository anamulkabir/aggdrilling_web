import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { TaskTypeFormModalComponent } from 'app/modals/task-type-form-modal/task-type-form-modal.component';

@Component({
  selector: 'app-task-types',
  templateUrl: './task-types.component.html',
  styleUrls: ['./task-types.component.scss']
})
export class TaskTypesComponent implements OnInit {
  public taskTypesList;
  public types;
  p=1;
  termTaskType;
  total;
  constructor(private firestore:AngularFirestore,public dialog: MatDialog,private toastrService: ToastrService){}

  ngOnInit() {
    this.firestore.collection('taskTypes').snapshotChanges().subscribe(data => {
      this.taskTypesList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      this.types=[];
      for (let i = 0; i < this.taskTypesList[0].types.length; i++) {
        this.types.push({'name':this.taskTypesList[0].types[i]});
      }
      console.log('types : ',this.types)
    });
  }
  openDialog(item?) {
    this.dialog.open(TaskTypeFormModalComponent, {
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

}
