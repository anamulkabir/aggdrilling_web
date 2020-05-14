import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import Swal from 'sweetalert2';
import { ProjectFormModalComponent } from 'app/modals/project-form-modal/project-form-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  public projectList;
  public appConfig;
  public userRole=localStorage.getItem('role');
  public optionView;
  p=1;
  termProject;
  total;
  constructor(private firestore:AngularFirestore,private afAuth:AngularFireAuth,public router:Router, public dialog: MatDialog,private toastrService: ToastrService){}

  ngOnInit() {
   
    
    this.firestore.collection('projects').snapshotChanges().subscribe(data => {
      let projectList=[]
      projectList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })

      this.firestore.collection('users/'+this.afAuth.auth.currentUser.uid+'/permitProjects',ref=>ref.where('isActive','==',true)).snapshotChanges().subscribe(data => {
        let userProjectList=[]
        userProjectList= data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data() as object
          } 
        })
        
      let filter_by_permission = [];
       for (let i = 0; i < userProjectList.length; i++) {
        filter_by_permission.push(userProjectList[i].project.projectCode)
         
       }
        console.log(filter_by_permission)
        
      this.projectList = projectList.filter(function(project){
          return filter_by_permission.includes(project.projectCode);
      });
      console.log('this.projectList',this.projectList);

    });
  })

  }
  openDialog(item?) {
    this.dialog.open(ProjectFormModalComponent, {
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
   gotodetails(item){
     this.router.navigate(['/projects/'+item.id]);
   }

   noPermitionMsg(){
    Swal.fire({
      icon: 'error',
      title: 'Restricted',
      text: "Sorry, You don't have permisson on this project"
    })
   }

   checkPermition(item){
     console.log(item);
    this.optionView=undefined;
    this.firestore.firestore.collection('users/'+this.afAuth.auth.currentUser.uid+'/permitProjects').where('isActive','==',true).where('project.id','==',item).get()
    .then((snapshot)  => { 
      if (snapshot.empty) {
      this.optionView=false;
      }
      else{
        this.optionView=true;      
      }
    })
   }
   
  gotoWorksheets(item){
    this.router.navigate(['/projects-worksheets/'+item.id]);
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
        this.firestore.doc('projects/' + item.id).delete();
        Swal.fire(
          'Deleted!',
          'Record has been deleted.',
          'success'
        )
      }
    })
  }
}
