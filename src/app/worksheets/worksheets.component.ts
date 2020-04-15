import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { WorksheetDetailsFormModalComponent } from 'app/modals/worksheet-details-form-modal/worksheet-details-form-modal.component';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-worksheets',
  templateUrl: './worksheets.component.html',
  styleUrls: ['./worksheets.component.scss']
})
export class WorksheetsComponent implements OnInit {
  enableOP_Description = localStorage.getItem('enableOP');
  enableHQ_Description = localStorage.getItem('enableHQ');
  enableGO_Description = localStorage.getItem('enableGO');
  approved_Description = localStorage.getItem('approved');
  public project_worksheet;
  public projectDetailsList;
  public appConfig;
  p=1;
  termWorksheet;
  total;
  addWorksheetButtonShow=false;
  constructor(private firestore:AngularFirestore,private afAuth:AngularFireAuth,private route: ActivatedRoute,
    private router: Router,public dialog: MatDialog,private toastrService: ToastrService){}

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
              this.firestore.collection('users/'+this.afAuth.auth.currentUser.uid+'/permitProjects',ref=>ref.where('project.id','==',this.route.snapshot.paramMap.get('id')).where('isActive','==',true)).snapshotChanges().subscribe(data => {
                let permit_status=[];
                permit_status= data.map(e => {
                return {
                id: e.payload.doc.id,
                ...e.payload.doc.data() as object
                } 
                })
                let user_status=[];
                let action=[];
                user_status=permit_status[0].permitSteps;

                
                if (user_status.includes('enableOP')) {
                  this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/workSheetStages',ref=>ref.where('name','==','enableOP')).snapshotChanges().subscribe(data => {
                    let project_workSheetStages=[];
                    project_workSheetStages= data.map(e => {
                      return {
                        id: e.payload.doc.id,
                        ...e.payload.doc.data() as object
                      } 
                    })
                    console.log('project_workSheetStages',project_workSheetStages); 
                    for (let i = 0; i < project_workSheetStages[0].actions.length; i++) {
                      action.push(project_workSheetStages[0].actions[i]);
                      }
                  })
                }

                   if (user_status.includes('enableHQ')) {
                  this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/workSheetStages',ref=>ref.where('name','==','enableHQ')).snapshotChanges().subscribe(data => {
                    let project_workSheetStages=[];
                    project_workSheetStages= data.map(e => {
                      return {
                        id: e.payload.doc.id,
                        ...e.payload.doc.data() as object
                      } 
                    })
                    console.log('project_workSheetStages',project_workSheetStages); 
                    for (let i = 0; i < project_workSheetStages[0].actions.length; i++) {
                      action.push(project_workSheetStages[0].actions[i]);
                      } 
                  })
                }
            
            
                if (user_status.includes('enableGO')) {
                  this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/workSheetStages',ref=>ref.where('name','==','enableGO')).snapshotChanges().subscribe(data => {
                    let project_workSheetStages=[];
                    project_workSheetStages= data.map(e => {
                      return {
                        id: e.payload.doc.id,
                        ...e.payload.doc.data() as object
                      } 
                    })
                    console.log('project_workSheetStages',project_workSheetStages); 
                    for (let i = 0; i < project_workSheetStages[0].actions.length; i++) {
                      action.push(project_workSheetStages[0].actions[i]);
                      }
                  })
                  
                }
               
               this.projectDetailsList= (docRef.id,docRef.data())   
               console.log('this.projectDetailsList',this.projectDetailsList);      
               
              
               this.firestore.collection('projects/'+this.route.snapshot.paramMap.get('id')+'/worksheet').snapshotChanges().subscribe(data => {
                let worksheetList=[]
                worksheetList= data.map(e => {
                  return {
                    id: e.payload.doc.id,
                    ...e.payload.doc.data() as object
                  } 
                })
                console.log(action);
                if (action.includes('add')) {
                  this.addWorksheetButtonShow=true;
                }
                console.log('worksheetList',worksheetList);

                if (localStorage.getItem('role')=='geologist') {
                  this.project_worksheet = worksheetList.filter(function(worksheet){
                    return worksheet.currentStatus=='enableGO' || worksheet.currentStatus=='approved';
                });
                } else {
                  this.project_worksheet = worksheetList;
                }
                
                console.log('this.project_worksheet',this.project_worksheet);
                
              }); 
              });  
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

  
}
    
getDescription(item){
  for (let i = 0; i < this.appConfig[0].stageNames.length; i++) {
    if (this.appConfig[0].stageNames[i].name==item) {
      return this.appConfig[0].stageNames[i].description;
      }
  }
}

    gotoWorksheetsDetails(item){
    localStorage.setItem('project_id',this.route.snapshot.paramMap.get('id'));
    this.router.navigate(['/projects-worksheets/'+this.route.snapshot.paramMap.get('id')+'/details/'+item.id]);
  }

  openWorksheetsDetails(item?){
   
    if (item!=undefined) { 
        this.dialog.open(WorksheetDetailsFormModalComponent, {
        data: {
          projectId: this.route.snapshot.paramMap.get('id'),
          worksheetId: item.id,
          item:item
        },
        position:{
          top:'40px',
          bottom:'10px'
        },
        height:'90vh',
        panelClass: 'myapp-no-padding-dialog'
       });
    }
    else{
      this.dialog.open(WorksheetDetailsFormModalComponent, {
        data: {
          projectId: this.route.snapshot.paramMap.get('id'),
          item:item
        },
        position:{
          top:'40px',
          bottom:'10px'
        },
        height:'90vh',
        panelClass: 'myapp-no-padding-dialog'
      });
    }
  }


  paginationStart(){
    this.p=1;
  }
   
  deleteProWorksheet(item){
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
        this.firestore.doc('projects/'+this.route.snapshot.paramMap.get('id')+'/worksheet/' + item.id).delete().catch((error) => {
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
