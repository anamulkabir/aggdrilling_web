import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectGeoFormModalComponent } from 'app/modals/project-geo-form-modal/project-geo-form-modal.component';
import { ProjectRigsFormModalComponent } from 'app/modals/project-rigs-form-modal/project-rigs-form-modal.component';
import { ProjectHolesFormModalComponent } from 'app/modals/project-holes-form-modal/project-holes-form-modal.component';
import { ProjectWorkerFormModalComponent } from 'app/modals/project-worker-form-modal/project-worker-form-modal.component';
import { ProjectTaskFormModalComponent } from 'app/modals/project-task-form-modal/project-task-form-modal.component';
import { ProjectCoreSizeFormModalComponent } from 'app/modals/project-core-size-form-modal/project-core-size-form-modal.component';
import { ProjectMaterialsFormModalComponent } from 'app/modals/project-materials-form-modal/project-materials-form-modal.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { WorksheetStagesFormModalComponent } from 'app/modals/worksheet-stage-form-modal/worksheet-stage-form-modal.component';

@Component({
  selector: 'app-project-details',
  templateUrl: './projects-details.component.html',
  styleUrls: ['./projects-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  public project_geologist;
  public project_rigs;
  public project_holes;
  public project_geologist_status_query;
  public projectDetailsList;
  public geologistList;
  public rigsList;
  public project_worker;
  public workerList;
  public project_task;
  public project_coreSizes;
  public project_materials;
  public project_workSheetStages;
  public appConfig;

  constructor(private firestore:AngularFirestore,private afAuth:AngularFireAuth,private route: ActivatedRoute,private router: Router,public dialog: MatDialog,private toastrService: ToastrService){}

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

 this.firestore.firestore.collection('projects/').doc(this.route.snapshot.paramMap.get('id')).get()
   .then( (docRef ) => {    
     if (docRef.exists) {
      this.firestore.firestore.collection('users/'+this.afAuth.auth.currentUser.uid+'/permitProjects').where('project.id','==',this.route.snapshot.paramMap.get('id')).where('isActive','==',true).get()
          .then((snapshot)  => { 
            if (snapshot.empty) {
              Swal.fire({
                icon: 'error',
                title: 'Restricted',
                text: "Sorry, You don't have permisson on this project"
              }).then(()=>{
                this.router.navigate(['projects']);
              })
            }
            else{
              this.projectDetailsList= (docRef.id,docRef.data())   
              console.log('this.projectDetailsList',this.projectDetailsList);         
            }
          })     
        }
     else{
       Swal.fire({
        icon: 'error',
        title: 'Not found !',
        text: 'There is no information with this id!'
      }).then(()=>{
        this.router.navigate(['projects']);
      })
     }
  })

    this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/geologists').snapshotChanges().subscribe(data => {
      this.project_geologist= data.map(e => {
        return {
          id: e.payload.doc.id,lastName: name,
          ...e.payload.doc.data() as object
        } 
      }).sort((a,b)=> (a.lastName > b.lastName ? 1 : -1))
      console.log('this.project_geologist',this.project_geologist);
    });
  

    this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/geologists', ref => ref.where('isActive','==',true)).snapshotChanges().subscribe(data => {
      this.project_geologist_status_query= data.map(e => {
        return {
         id: e.payload.doc.id,
         ...e.payload.doc.data() as object
        }
      })
     console.log('this.project_geologist_status_query',this.project_geologist_status_query);
    });

  
    this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/rigs').snapshotChanges().subscribe(data => {
      this.project_rigs= data.map(e => {
        return {
          id: e.payload.doc.id,serial:name,
          ...e.payload.doc.data() as object
        } 
      }).sort((a,b)=> (a.serial > b.serial ? 1 : -1))
      console.log('this.project_rigs',this.project_rigs);
    });


    this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/holes').snapshotChanges().subscribe(data => {
      let holeList=[];
      holeList = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      this.project_holes=[];
      for (let i = 0; i < holeList[0].holes.length; i++) {
        this.project_holes.push(holeList[0].holes[i]);
      }
      console.log('this.project_holes',this.project_holes);
    });

    this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/workers').snapshotChanges().subscribe(data => {
      this.project_worker= data.map(e => {
        return {
          id: e.payload.doc.id,lastName: name,
          ...e.payload.doc.data() as object
        } 
      }).sort((a,b)=> (a.lastName > b.lastName ? 1 : -1))
      console.log('this.project_worker',this.project_worker);
    });

    this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/tasks').snapshotChanges().subscribe(data => {
      this.project_task= data.map(e => {
        return {
          id: e.payload.doc.id, name:name,
          ...e.payload.doc.data() as object
        } 
      }).sort((a,b)=> (a.name > b.name ? 1 : -1))
      console.log('this.project_task',this.project_task);
    });

    this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/coreSizes').snapshotChanges().subscribe(data => {
      this.project_coreSizes= data.map(e => {
        return {
          id: e.payload.doc.id,core:name,
          ...e.payload.doc.data() as object
        } 
      }).sort((a,b)=> (a.core > b.core ? 1 : -1))
      console.log('this.project_coreSizes',this.project_coreSizes);
    });
    
    this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/materials').snapshotChanges().subscribe(data => {
      this.project_materials= data.map(e => {
        return {
          id: e.payload.doc.id, name:name,
          ...e.payload.doc.data() as object
        } 
      }).sort((a,b)=> (a.name > b.name ? 1 : -1))
      console.log('this.project_materials',this.project_materials);
    });

    this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/workSheetStages').snapshotChanges().subscribe(data => {
      this.project_workSheetStages= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.project_workSheetStages',this.project_workSheetStages);
    });

  }
  

  getDescription(item){
    for (let i = 0; i < this.appConfig[0].stageNames.length; i++) {
      if (this.appConfig[0].stageNames[i].name==item) {
        return this.appConfig[0].stageNames[i].description;
        }
    }
}


  statusToogoleChangeForGeologist(prGeo,e) {
    
    if(e.checked){
      if (this.project_geologist_status_query.length==0) {
      let body={
        geologistId: prGeo.geologistId,
        isActive: true
      }
      this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/geologists').doc(prGeo.id).update(body).then(()=>{
        this.toastrService.success('Record updated successfully !', 'Success');
      }).catch((error) => {
        this.toastrService.error(error.message);
      }) 
    }
      else{
        this.toastrService.error('You can add only one geologist in a project !','Error');
        setTimeout(() => {
          e.source.checked = false;  
        }, 300);
        
      }
    }
    else{
      let body={
          geologistId: prGeo.geologistId,
          isActive: false
      }
      this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/geologists').doc(prGeo.id).update(body).then(()=>{
        this.toastrService.success('Record updated successfully !', 'Success');
      }).catch((error) => {
        this.toastrService.error(error.message);
      }) 
    }
  }


  openProjectGeologistForm(item?) {
    this.dialog.open(ProjectGeoFormModalComponent, {
      data: {
        projectId: this.route.snapshot.paramMap.get('id'),
        item:item
      },
      position:{
        top:'50px'
      }
    });
   }
   
   openProjectRigsForm(item?) {
    this.dialog.open(ProjectRigsFormModalComponent, {
      data: {
        projectId: this.route.snapshot.paramMap.get('id'),
        item:item
      },
      position:{
        top:'50px'
      }
    });
   }


   openProjectHolesForm(item?) {
    this.dialog.open(ProjectHolesFormModalComponent, {
      data: {
        projectId: this.route.snapshot.paramMap.get('id'),
        item:item
      },
      position:{
        top:'50px'
      }
    });
   }

   
   openProjectWorkerForm(item?) {
    this.dialog.open(ProjectWorkerFormModalComponent, {
      data: {
        projectId: this.route.snapshot.paramMap.get('id'),
        item:item
      },
      position:{
        top:'50px'
      }
    });
   }

   openProjectTaskForm(item?) {
    this.dialog.open(ProjectTaskFormModalComponent, {
      data: {
        projectId: this.route.snapshot.paramMap.get('id'),
        item:item
      },
      position:{
        top:'50px'
      }
    });
   }

   openProjectCoreSizesForm(item?) {
    this.dialog.open(ProjectCoreSizeFormModalComponent, {
      data: {
        projectId: this.route.snapshot.paramMap.get('id'),
        item:item
      },
      position:{
        top:'50px'
      }
    });
   }

   openProjectMaterialsForm(item?) {
    this.dialog.open(ProjectMaterialsFormModalComponent, {
      data: {
        projectId: this.route.snapshot.paramMap.get('id'),
        item:item
      },
      position:{
        top:'50px'
      }
    });
   }

   openProjectWorksheetStagesForm(item?) {
    this.dialog.open(WorksheetStagesFormModalComponent, {
      data: {
        projectId: this.route.snapshot.paramMap.get('id'),
        item:item
      },
      position:{
        top:'50px'
      }
    });
   }


   deleteProGeo(item){
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
        this.firestore.doc('project_geologist/' + item.id).delete().catch((error) => {
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

  deleteProRigs(item){
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
        this.firestore.doc('projects/'+this.route.snapshot.paramMap.get('id')+'/rigs/' + item.id).delete().catch((error) => {
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



  deleteProHoles(item){
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
        this.project_holes.splice(item, 1);
    let body=
        { 
          holes: this.project_holes
        }
        console.log(body);
        this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/holes').doc('holes').update(body).then(()=>{
          Swal.fire(
            'Deleted!',
            'Record has been deleted.',
            'success'
          )
        }).catch((error) => {
          this.toastrService.error(error.message);
        }) 
      }
    })
  }

  deleteProWorker(item){
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
        this.firestore.doc('projects/'+this.route.snapshot.paramMap.get('id')+'/workers/' + item.id).delete().catch((error) => {
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

  deleteProTask(item){
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
        this.firestore.doc('projects/'+this.route.snapshot.paramMap.get('id')+'/tasks/' + item.id).delete().catch((error) => {
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

  deleteProCoreSize(item){
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
        this.firestore.doc('projects/'+this.route.snapshot.paramMap.get('id')+'/coreSizes/' + item.id).delete().catch((error) => {
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

  deleteProMaterial(item){
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
        this.firestore.doc('projects/'+this.route.snapshot.paramMap.get('id')+'/materials/' + item.id).delete().catch((error) => {
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

  deleteProWorksheetStages(item){
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
        this.firestore.doc('projects/'+this.route.snapshot.paramMap.get('id')+'/workSheetStages/' + item.id).delete().catch((error) => {
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
