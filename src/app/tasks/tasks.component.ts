import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { TaskFormModalComponent } from 'app/modals/task-form-modal/task-form-modal.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  public tasksList;
  p=1;
  termTasks;
  total;
  constructor(private firestore:AngularFirestore,public dialog: MatDialog,private toastrService: ToastrService){}

  ngOnInit() {
    this.firestore.collection('tasks').snapshotChanges().subscribe(data => {
      this.tasksList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.tasksList',this.tasksList);
    });
  }
  openDialog(item?) {
    this.dialog.open(TaskFormModalComponent, {
      data: {
        item: item
      },
      position:{
        top:'50px'
      }
    });
   }

   statusToogoleChangeForTask(item,e) {
    
    if(e.checked){
      let body={
        isActive: true
      }
      this.firestore.collection('tasks/').doc(item.id).update(body).then(()=>{
        this.toastrService.success('Record updated successfully !', 'Success');
      }).catch((error) => {
        this.toastrService.error(error.message);
      }) 
    
   
    }
    else{
      let body={
          isActive: false
      }
      this.firestore.collection('tasks/').doc(item.id).update(body).then(()=>{
        this.toastrService.success('Record updated successfully !', 'Success');
      }).catch((error) => {
        this.toastrService.error(error.message);
      }) 
    }
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
        this.firestore.doc('tasks/' + item.id).delete();
        Swal.fire(
          'Deleted!',
          'Record has been deleted.',
          'success'
        )
      }
    })
  }

}
