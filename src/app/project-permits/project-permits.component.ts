import { Component, OnInit } from '@angular/core';

import { UserProjectPermitFormModalComponent } from 'app/modals/user-project-permit-modal/user-project-permit-modal.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-project-permits',
  templateUrl: './project-permits.component.html',
  styleUrls: ['./project-permits.component.scss']
})
export class ProjectPermitsComponent implements OnInit {
  public userDetails;
  public appConfig;
  p=1;
  public user_project_permit_details_list;
  constructor(private firestore:AngularFirestore,private route: ActivatedRoute,private router: Router,public dialog: MatDialog,private toastrService: ToastrService){}

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

 this.firestore.firestore.collection('users').doc(this.route.snapshot.paramMap.get('id')).get()
   .then( (docRef ) => {    
     if (docRef.exists) {
       
    this.userDetails= (docRef.id,docRef.data());   
    console.log('this.userDetails',this.userDetails);
     }
     else{
       Swal.fire({
        icon: 'error',
        title: 'Not found !',
        text: 'There is no information with this id!'
      }).then(()=>{
        this.router.navigate(['user']);
      })
     }
  })

  this.firestore.collection('users/'+this.route.snapshot.paramMap.get('id')+'/permitProjects',ref=>ref.orderBy('project.startDate','desc')).snapshotChanges().subscribe(data => {
    this.user_project_permit_details_list= data.map(e => {
      return {
        id: e.payload.doc.id,
        ...e.payload.doc.data() as object
      } 
    })
    console.log('this.user_project_permit_details_list',this.user_project_permit_details_list);
  });

  }

  

getDescription(item){
  for (let i = 0; i < this.appConfig[0].stageNames.length; i++) {
    if (this.appConfig[0].stageNames[i].name==item) {
      return this.appConfig[0].stageNames[i].description;
      }
  }
}


  paginationStart(){
    this.p=1;
  }
  openDialog(item?) { 
    this.dialog.open(UserProjectPermitFormModalComponent, {
    data: {
      userId: this.route.snapshot.paramMap.get('id'),
      item:item
    },
    position:{
      top:'50px'
    }
  });
   }


   statusToogoleChangeForUser(item,e) {
    
    if(e.checked){
      let body={
        isActive: true
      }
      this.firestore.collection('users/'+this.route.snapshot.paramMap.get('id')+'/permitProjects').doc(item.id).update(body).then(()=>{
        this.toastrService.success('Record updated successfully !', 'Success');
      }).catch((error) => {
        this.toastrService.error(error.message);
      }) 
    
   
    }
    else{
      let body={
          isActive: false
      }
      this.firestore.collection('users/'+this.route.snapshot.paramMap.get('id')+'/permitProjects').doc(item.id).update(body).then(()=>{
        this.toastrService.success('Record updated successfully !', 'Success');
      }).catch((error) => {
        this.toastrService.error(error.message);
      }) 
    }
  }


   deleteProjectPermit(item){
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
        this.firestore.doc('users/'+this.route.snapshot.paramMap.get('id')+'/permitProjects/'+ item.id).delete().catch((error) => {
          this.toastrService.error(error.message);
        }) 
        Swal.fire(
          'Deleted!',
          'Record has been deleted.',
          'success'
        )
      }
    })
  }


}
