import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import Swal from 'sweetalert2';
import { ProjectStepFormModalComponent } from 'app/modals/project-step-form-modal/project-step-form-modal.component';
@Component({
  selector: 'app-project-steps',
  templateUrl: './project-steps.component.html',
  styleUrls: ['./project-steps.component.scss']
})
export class ProjectStepsComponent implements OnInit {
  public projectStepsList;
  public appConfig;
  constructor(private firestore:AngularFirestore,private afAuth:AngularFireAuth, public dialog: MatDialog,private toastrService: ToastrService){}
  ngOnInit() {

    this.firestore.collection('appConfig').snapshotChanges().subscribe(data => {
      this.appConfig = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      this.getDescription(null);
    })

     this.firestore.collection('projectSteps').snapshotChanges().subscribe(data => {
      this.projectStepsList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.projectStepsList',this.projectStepsList);
    });
  }
  


getDescription(item){
    for (let i = 0; i < this.appConfig[0].stageNames.length; i++) {
      if (this.appConfig[0].stageNames[i].name==item) {
        return this.appConfig[0].stageNames[i].description;
        }
    }
}


  openDialog(item?) {
    this.dialog.open(ProjectStepFormModalComponent, {
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
        this.firestore.doc('projectSteps/' + item.id).delete();
        Swal.fire(
          'Deleted!',
          'Record has been deleted.',
          'success'
        )
      }
    })
  }

}