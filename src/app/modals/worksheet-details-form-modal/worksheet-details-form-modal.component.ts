import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { WorksheetConsumeMaterialsFormModalComponent } from '../worksheet-consume-materials-form-modal/worksheet-consume-materials-form-modal.component';
import { WorksheetMsgFormModalComponent } from 'app/modals/worksheet-msg-form-modal/worksheet-msg-form-modal.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'app/authenticationService/user.service';
import { ActivityLogDetailsModalComponent } from '../activity-log-details-modal/activity-log-details-modal.component';
import { WorksheetTaskLogsFormModalComponent } from '../worksheet-task-logs-form-modal/worksheet-task-logs-form-modal.component';

@Component({
  selector: 'app-worksheet-details-form-modal',
  templateUrl: './worksheet-details-form-modal.component.html',
  styleUrls: ['./worksheet-details-form-modal.component.scss'],
  providers: [DatePipe]
})
export class WorksheetDetailsFormModalComponent implements OnInit {
  public worksheetDetailsList;
  public project_worksheet_taskLogs;
  public project_worksheet_msg;
  public project_worksheet_status;
  public project_worksheet_consumeMaterials; 
  public worksheetActivityLogs; 
  public project_rigs;
  public project_holes;
  public user_info;
  public actionEnable=false;
  public activityLogsShow=false;
  public deleteWorksheetBtnShow=false;
  public forwardWorksheetBtnShow=false;
  public worksheetStatus;
  public userStatus;
  public worksheetReport;
  public holesView=false;
  registerForm: FormGroup;
  submitted = false;
  constructor(private firestore:AngularFirestore,private afAuth:AngularFireAuth,private route: ActivatedRoute,private router: Router,public dialog: MatDialog,
    private toastrService: ToastrService,private excelService:UserService,private location: Location,public datePipe : DatePipe,private formBuilder: FormBuilder,public dialogRef: MatDialogRef<WorksheetDetailsFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any){}

  ngOnInit() {


    console.log('ID : ',this.data.projectId,this.data.worksheetId);
    this.firestore.collection('projects/'+this.data.projectId+'/rigs').snapshotChanges().subscribe(data => {
      this.project_rigs= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.project_rigs',this.project_rigs);
    });

   
    this.firestore.collection('projects/'+this.data.projectId+'/holes').snapshotChanges().subscribe(data => {
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

    this.registerForm = this.formBuilder.group({
      id: [],
      entryBy: [],
      entryDate: [],
      rigs: ['', Validators.required],
      holes: [],
      workDate: ['', Validators.required],
      dip: ['', Validators.maxLength(5)]
  });

        this.firestore.collection('users/',ref=>ref.where('email','==',this.afAuth.auth.currentUser.email)).snapshotChanges().subscribe(data => {
          let user_info=[];
          user_info= data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as object
            } 
          })
          console.log('this.user_info', user_info[0]);
        this.registerForm.controls.entryBy.setValue(user_info[0]);
        })
    
        this.registerForm.controls.entryDate.setValue(new Date());

      if (this.data.item!==undefined) {
        this.holesView=true;
        this.registerForm.controls.id.setValue(this.data.item.id);
        this.registerForm.controls.rigs.setValue(this.data.item.rigs);
        this.registerForm.controls.holes.setValue(this.data.item.holes);
        this.registerForm.controls.dip.setValue(this.data.item.dip);
        this.registerForm.controls.entryBy.setValue(this.data.item.entryBy);
        this.registerForm.controls.entryDate.setValue(new Date(this.data.item.entryDate));
        this.registerForm.controls.workDate.setValue(new Date(this.data.item.workDate + " 00:00:00 AM"));
        console.log('data utc', this.registerForm.controls.workDate);
      }

      if (this.data.worksheetId!=undefined) {
        
          this.firestore.firestore.collection('projects/'+this.data.projectId+'/worksheet/').doc(this.data.worksheetId).get()
          .then( (docRef ) => {    
            if (docRef.exists) {
              this.firestore.firestore.collection('users/'+this.afAuth.auth.currentUser.uid+'/permitProjects').where('project.id','==',this.data.projectId).get()
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
                    
                    this.firestore.collection('users/'+this.afAuth.auth.currentUser.uid+'/permitProjects',ref=>ref.where('project.id','==',this.data.projectId)).snapshotChanges().subscribe(data => {
                      let permit_status=[];
                      permit_status= data.map(e => {
                        return {
                          id: e.payload.doc.id,
                          ...e.payload.doc.data() as object
                        } 
                      })

                      this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/status',ref=>(ref.orderBy('entryDate','desc').limit(1))).snapshotChanges().subscribe(data => {
                      let worksheet_status=[];
                        worksheet_status= data.map(e => {
                          return {
                            id: e.payload.doc.id,
                            ...e.payload.doc.data() as object
                          } 
                        })



                        if (this.data.item==undefined) {
                          this.worksheetStatus='enableOP';
                        } else {
                          this.worksheetStatus=this.data.item.currentStatus;
                        }
                        console.log('permit_active',permit_status[0].isActive);
                        console.log('permit_status',permit_status[0].permitSteps);
                        console.log('worksheet_status',this.worksheetStatus);
                        console.log('match result',permit_status[0].permitSteps.includes(this.worksheetStatus));
                
                        this.userStatus=permit_status[0].permitSteps[0];
                        console.log('this.userStatus',this.userStatus)
                        console.log('this.worksheetStatus',this.worksheetStatus)
                          if(permit_status[0].isActive==true){
                                  if ((permit_status[0].permitSteps.includes(this.worksheetStatus)||permit_status[0].permitSteps.includes('enableHQ')) && this.worksheetStatus!='approved') {

                                      let user_status=[];
                                      let action=[];
                                      user_status=permit_status[0].permitSteps;
                      
                                      
                                      if (user_status.includes('enableOP') && this.worksheetStatus=='enableOP') {
                                        this.firestore.collection('projects/'+this.data.projectId+'/workSheetStages',ref=>ref.where('name','==','enableOP')).snapshotChanges().subscribe(data => {
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
                                        this.firestore.collection('projects/'+this.data.projectId+'/workSheetStages',ref=>ref.where('name','==','enableHQ')).snapshotChanges().subscribe(data => {
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
                                  
                                  
                                      if (user_status.includes('enableGO') && this.worksheetStatus=='enableGO') {
                                        this.firestore.collection('projects/'+this.data.projectId+'/workSheetStages',ref=>ref.where('name','==','enableGO')).snapshotChanges().subscribe(data => {
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

                                      this.firestore.collection('projects/'+this.data.projectId+'/workSheetStages').snapshotChanges().subscribe(data => {
                                        let project_workSheetStages=[];
                                        project_workSheetStages= data.map(e => {
                                          return {
                                            id: e.payload.doc.id,
                                            ...e.payload.doc.data() as object
                                          } 
                                        })
                                         console.log(action);
                                        if (action.includes('update')) {
                                          this.actionEnable=true;
                                        }
                                        if (action.includes('submit')) {
                                      this.forwardWorksheetBtnShow=true;  
                                        }
                                      });
                                     
                                      
                                  }
                                  else{ 
                                    this.actionEnable=false;
                                  }
                            }
                          else{ 
                            this.actionEnable=false;
                            }
                        
                          if (permit_status[0].permitSteps.includes('enableHQ')) {
                            this.activityLogsShow=true;
                            this.deleteWorksheetBtnShow=true;
                          }
                
                
                
                
                        this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/taskLogs').snapshotChanges().subscribe(data => {
                          this.project_worksheet_taskLogs= data.map(e => {
                            return {
                              id: e.payload.doc.id, shift: name, startTime: name,
                              ...e.payload.doc.data() as object
                            } 
                          }).sort(
                              function mysortfunction(a, b) {
                                if (a.shift < b.shift) {
                                  return -1;
                                }
                                if (a.shift > b.shift) {
                                  return 1;
                                }
                                if (new Date('1970-1-1 ' + a.startTime) < new Date('1970-1-1 ' + b.startTime)) {
                                  return -1;
                                }
                                if (new Date('1970-1-1 ' + a.startTime) > new Date('1970-1-1 ' + b.startTime)) {
                                  return 1;
                                }
                                return 0;
                              }                          )
                          console.log('this.project_worksheet_taskLogs',this.project_worksheet_taskLogs);
                        });
                      
                        this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/msg',ref=>ref.orderBy('entryDate','desc')).snapshotChanges().subscribe(data => {
                          this.project_worksheet_msg= data.map(e => {
                            return {
                              id: e.payload.doc.id,
                              ...e.payload.doc.data() as object
                            } 
                          })
                          console.log('this.project_worksheet_msg',this.project_worksheet_msg);
                        });
                      
                        
                        this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/status',ref=>(ref.orderBy('entryDate','desc').limit(1))).snapshotChanges().subscribe(data => {
                          this.project_worksheet_status= data.map(e => {
                            return {
                              id: e.payload.doc.id,
                              ...e.payload.doc.data() as object
                            } 
                          })
                          console.log('this.project_worksheet_status',this.project_worksheet_status);
                        });

                        this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/activityLogs',ref=>(ref.orderBy('changeDate','desc'))).snapshotChanges().subscribe(data => {
                          this.worksheetActivityLogs= data.map(e => {
                            return {
                              id: e.payload.doc.id,
                              ...e.payload.doc.data() as object
                            } 
                          })
                          console.log('this.worksheetActivityLogs',this.worksheetActivityLogs);
                        });
                        
                      
                        this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/consumeMaterials').snapshotChanges().subscribe(data => {
                          this.project_worksheet_consumeMaterials= data.map(e => {
                            return {
                              id: e.payload.doc.id,
                              ...e.payload.doc.data() as object
                            } 
                          })
                          console.log('this.project_worksheet_consumeMaterials',this.project_worksheet_consumeMaterials);
                        });
                       
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
  }

  get f() { return this.registerForm.controls; }


  reload(){
                    
    this.firestore.collection('users/'+this.afAuth.auth.currentUser.uid+'/permitProjects',ref=>ref.where('project.id','==',this.data.projectId)).snapshotChanges().subscribe(data => {
      let permit_status=[];
      permit_status= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })

      this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/status',ref=>(ref.orderBy('entryDate','desc').limit(1))).snapshotChanges().subscribe(data => {
      let worksheet_status=[];
        worksheet_status= data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data() as object
          } 
        })


        if (this.data.item==undefined) {
          this.worksheetStatus='enableOP';
        } else {
          this.worksheetStatus=this.data.item.currentStatus;
        }
        console.log('permit_active',permit_status[0].isActive);
        console.log('permit_status',permit_status[0].permitSteps);
        console.log('worksheet_status',this.worksheetStatus);
        console.log('match result',permit_status[0].permitSteps.includes(this.worksheetStatus));

        this.userStatus=permit_status[0].permitSteps[0];
        console.log('this.userStatus',this.userStatus)
        console.log('this.worksheetStatus',this.worksheetStatus)
          if(permit_status[0].isActive==true){
                  if ((permit_status[0].permitSteps.includes(this.worksheetStatus)||permit_status[0].permitSteps.includes('enableHQ')) && this.worksheetStatus!='approved') {
                    
                     
                    let user_status=[];
                    let action=[];
                    user_status=permit_status[0].permitSteps;
    
                    
                    if (user_status.includes('enableOP') && this.worksheetStatus=='enableOP') {
                      this.firestore.collection('projects/'+this.data.projectId+'/workSheetStages',ref=>ref.where('name','==','enableOP')).snapshotChanges().subscribe(data => {
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
                      this.firestore.collection('projects/'+this.data.projectId+'/workSheetStages',ref=>ref.where('name','==','enableHQ')).snapshotChanges().subscribe(data => {
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
                
                
                    if (user_status.includes('enableGO') && this.worksheetStatus=='enableGO') {
                      this.firestore.collection('projects/'+this.data.projectId+'/workSheetStages',ref=>ref.where('name','==','enableGO')).snapshotChanges().subscribe(data => {
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

                    this.firestore.collection('projects/'+this.data.projectId+'/workSheetStages').snapshotChanges().subscribe(data => {
                      let project_workSheetStages=[];
                      project_workSheetStages= data.map(e => {
                        return {
                          id: e.payload.doc.id,
                          ...e.payload.doc.data() as object
                        } 
                      })
                       console.log(action);
                      if (action.includes('update')) {
                        this.actionEnable=true;
                      }
                      if (action.includes('submit')) {
                    this.forwardWorksheetBtnShow=true;  
                      }
                    });
                   
                  }
                  else{ 
                    this.actionEnable=false;
                  }
            }
          else{ 
            this.actionEnable=false;
            }
        
          if (permit_status[0].permitSteps.includes('enableHQ')) {
            this.activityLogsShow=true;
            this.deleteWorksheetBtnShow=true;
          }




        this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/taskLogs').snapshotChanges().subscribe(data => {
          this.project_worksheet_taskLogs= data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as object
            } 
          })
          console.log('this.project_worksheet_taskLogs',this.project_worksheet_taskLogs);
        });
      
        this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/msg',ref=>ref.orderBy('entryDate','desc')).snapshotChanges().subscribe(data => {
          this.project_worksheet_msg= data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as object
            } 
          })
          console.log('this.project_worksheet_msg',this.project_worksheet_msg);
        });
      
        
        this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/status',ref=>(ref.orderBy('entryDate','desc').limit(1))).snapshotChanges().subscribe(data => {
          this.project_worksheet_status= data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as object
            } 
          })
          console.log('this.project_worksheet_status',this.project_worksheet_status);
        });
        

        this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/activityLogs',ref=>(ref.orderBy('changeDate','desc'))).snapshotChanges().subscribe(data => {
          this.worksheetActivityLogs= data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as object
            } 
          })
          console.log('this.worksheetActivityLogs',this.worksheetActivityLogs);
        });
      
        this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/consumeMaterials').snapshotChanges().subscribe(data => {
          this.project_worksheet_consumeMaterials= data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as object
            } 
          })
          console.log('this.project_worksheet_consumeMaterials',this.project_worksheet_consumeMaterials);
        });
       
      });
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }    
  if (this.registerForm.value.id==null) {
    let body=
        { 
          rigs: this.registerForm.controls.rigs.value,
          holes: this.registerForm.controls.holes.value,
          dip: this.registerForm.controls.dip.value,
          entryBy: this.registerForm.controls.entryBy.value,
          currentStatus: 'enableOP',
          entryDate: this.datePipe.transform(this.registerForm.controls.entryDate.value, 'yyyy-MM-dd hh:mm:ss a'),
          workDate: this.datePipe.transform(this.registerForm.controls.workDate.value, 'yyyy-MM-dd'),
        }
        console.log(body);
        this.firestore.collection('projects/'+this.data.projectId+'/worksheet').add(body).then((docRef)=>{
          this.toastrService.success('Record added successfully !', 'Success');
          this.registerForm.controls.id.setValue(docRef.id);
          this.data.worksheetId=docRef.id;
          this.holesView=true;
          this.reload();
          let defaultStatus=
            { 
              entryBy: this.registerForm.controls.entryBy.value,
              entryDate:this.datePipe.transform(this.registerForm.controls.entryDate.value, 'yyyy-MM-dd hh:mm:ss a'),
              status: 'enableOP'
            }
            this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+docRef.id+'/status').add(defaultStatus).then(()=>{
              // this.toastrService.info('In worksheet status, enableOP is set by default', 'Information');
            }).catch((error) => {
              this.toastrService.error(error.message);
            }) 
        })
        .catch((error) => {
          this.toastrService.error(error.message);
        })         
    }
    else {     
      let body=
        { 
          rigs: this.registerForm.controls.rigs.value,
          holes: this.registerForm.controls.holes.value,
          dip: this.registerForm.controls.dip.value,
          entryBy: this.registerForm.controls.entryBy.value,
          entryDate: this.datePipe.transform(this.registerForm.controls.entryDate.value, 'yyyy-MM-dd hh:mm:ss a'),
          workDate: this.datePipe.transform(this.registerForm.controls.workDate.value, 'yyyy-MM-dd'),
        }
        console.log(body);
      this.firestore.collection('projects/'+this.data.projectId+'/worksheet').doc(this.registerForm.value.id).update(body).then(()=>{
        // this.toastrService.success('Record updated successfully !', 'Success');
      }).catch((error) => {
        this.toastrService.error(error.message);
      }) 
    }
    
  }

  closeModal() {
    this.dialog.closeAll();
  }
  openWorksheetTaskLogsForm(item?) {
    this.dialog.open(WorksheetTaskLogsFormModalComponent, {
      data: {
        projectId: this.data.projectId,
        worksheetId: this.data.worksheetId,
        item:item
      },
      backdropClass: 'backdropBackground'
    });
   }

   openWorksheetMsgForm() {
    this.dialog.open(WorksheetMsgFormModalComponent, {
      data: {
        projectId: this.data.projectId,
        worksheetId: this.data.worksheetId,
        worksheetStatus: this.worksheetStatus
      },
      backdropClass: 'backdropBackground'
    });
   }


   openWorksheetConsumeMaterialsForm(item?) {
    this.dialog.open(WorksheetConsumeMaterialsFormModalComponent, {
      data: {
        projectId: this.data.projectId,
        worksheetId: this.data.worksheetId,
        item: item
      },
      backdropClass: 'backdropBackground'
    });
   }

   openActivityLogDetails(item?) {
    this.dialog.open(ActivityLogDetailsModalComponent, {
      data: {
        item:item
      },
      panelClass: 'myapp-no-padding-dialog',
      backdropClass: 'backdropBackground'
    });
   }

   deleteWorksheetTaskLogs(item){
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
        this.firestore.doc('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/taskLogs/'+item.id).delete().catch((error) => {
          this.toastrService.error(error.message);
        }).then(()=>{ 
          let changedData={
          changeDate:this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss a'),
          changedBy:this.afAuth.auth.currentUser.email,
          action:'deleted',
          collectionName:'task logs',
          changedItem:{ 
            taskLogs:(item)
                       }
                      }
 
         this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/activityLogs').add(changedData).then(()=>{
         }) 
        Swal.fire(
          'Deleted!',
          'Record has been deleted.',
          'success'
        )

        })
      }
    })
  }

  deleteWorksheetMsg(item){
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
        this.firestore.doc('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/msg/'+item.id).delete().catch((error) => {
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

  deleteWorksheetConsumeMaterials(item){
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
        this.firestore.doc('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/consumeMaterials/'+item.id).delete().catch((error) => {
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

  
  deleteProWorksheet(){
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
        
    this.firestore.firestore.collection('projects/'+this.data.projectId+'/worksheet/' + this.data.worksheetId+'/activityLogs').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.delete();
            });
          })
      .catch(err => {
        console.log('Error getting documents', err);
    });
    
    this.firestore.firestore.collection('projects/'+this.data.projectId+'/worksheet/' + this.data.worksheetId+'/consumeMaterials').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.delete();
            });
          })
      .catch(err => {
        console.log('Error getting documents', err);
    });

    this.firestore.firestore.collection('projects/'+this.data.projectId+'/worksheet/' + this.data.worksheetId+'/msg').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.delete();
            });
          })
      .catch(err => {
        console.log('Error getting documents', err);
    });

    this.firestore.firestore.collection('projects/'+this.data.projectId+'/worksheet/' + this.data.worksheetId+'/status').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.delete();
            });
          })
      .catch(err => {
        console.log('Error getting documents', err);
    }); 

    this.firestore.firestore.collection('projects/'+this.data.projectId+'/worksheet/' + this.data.worksheetId+'/taskLogs').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        doc.ref.delete();
          });
        })
    .catch(err => {
      console.log('Error getting documents', err);
  });
      this.firestore.doc('projects/'+this.data.projectId+'/worksheet/' + this.data.worksheetId).delete().catch((error) => {
        this.toastrService.error(error.message);
      }) 
        this.dialog.closeAll();
        Swal.fire(
          'Deleted!',
          'Record has been deleted.',
          'success'
        )
      }
    })
  }

  public changeValidationForDIP(){
    this.registerForm.controls.dip.setValidators(Validators.max(99999));
  }
  
  public holeClickEvent(){
    this.registerForm.controls.holes.setValue(null);
  }

  exportexcel(): void 
  {
    this.worksheetReport=[];

    for (let i = 0; i < this.project_worksheet_taskLogs.length; i++) {
     this.worksheetReport.push(
       {
         'Work Date':this.datePipe.transform(this.registerForm.controls.workDate.value, 'yyyy-MM-dd'),
         Rigs:this.registerForm.controls.rigs.value.serial,
         Holes:this.registerForm.controls.holes.value.name,
         Task:this.project_worksheet_taskLogs[i].task.name,
         Shift:this.project_worksheet_taskLogs[i].shift,
         'Start Time':this.project_worksheet_taskLogs[i].startTime,
         'End Time':this.project_worksheet_taskLogs[i].endTime,
         'Work Hours':this.project_worksheet_taskLogs[i].workHours,
         'Worker':this.project_worksheet_taskLogs[i].worker.firstName +' '+this.project_worksheet_taskLogs[i].worker.lastName,
         'Start Meter':this.project_worksheet_taskLogs[i].startMeter,
         'End Meter':this.project_worksheet_taskLogs[i].endMeter,
         'Core Size':this.project_worksheet_taskLogs[i].coreSize.core,
         Comment:this.project_worksheet_taskLogs[i].comment
       }
     )
      
    }

    this.excelService.exportAsExcelFile(this.worksheetReport, 'Rigs_No_'+this.registerForm.controls.rigs.value.serial+'_WorkDate_'+this.datePipe.transform(this.registerForm.controls.workDate.value, 'yyyy-MM-dd'));
  }

}
