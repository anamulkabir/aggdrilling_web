import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-worksheet-task-logs-form-modal',
  templateUrl: './worksheet-task-logs-form-modal.component.html',
  styleUrls: ['./worksheet-task-logs-form-modal.component.scss'],
  providers: [DatePipe]
})

export class WorksheetTaskLogsFormModalComponent implements OnInit, OnDestroy {
  public timeList=['7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
                    '12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
                    '5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM',
                    '10:00 PM','10:30 PM','11:00 PM','11:30 PM','12:00 AM','12:30 AM','1:00 AM','1:30 AM','2:00 AM','2:30 AM',
                    '3:00 AM','3:30 AM','4:00 AM','4:30 AM','5:00 AM','5:30 AM','6:00 AM','6:30 AM']
  public taskList;
  public coreSizes;
  public workersList;
  public workersOtherList;
  public helpersList;
  public drillersList;
  registerForm: FormGroup;
  submitted = false;
  public filteredList: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  public filteredList2: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  public filteredList3: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  public filteredList4: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  public filteredList5: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  public filteredList6: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  private _onDestroy = new Subject<void>();
  public listFilterCtrl: FormControl = new FormControl();
  public listFilterCtrl2: FormControl = new FormControl();
  public listFilterCtrl3: FormControl = new FormControl();
  public listFilterCtrl4: FormControl = new FormControl();
  public listFilterCtrl5: FormControl = new FormControl();
  public listFilterCtrl6: FormControl = new FormControl();
  constructor(public dialog: MatDialog,private toastrService: ToastrService,private formBuilder: FormBuilder,private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,public datePipe : DatePipe,public dialogRef: MatDialogRef<WorksheetTaskLogsFormModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
console.log('this.data',this.data);

    this.firestore.collection('projects/'+this.data.projectId+'/tasks').snapshotChanges().subscribe(data => {
      this.taskList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        }
      })
      console.log('taskList',this.taskList)

      this.filteredList2.next(this.taskList.slice());
      this.listFilterCtrl2.valueChanges
         .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterList2();
         });
  });

  this.firestore.collection('projects/'+this.data.projectId+'/coreSizes').snapshotChanges().subscribe(data => {
    this.coreSizes= data.map(e => {
      return {
        id: e.payload.doc.id,
        ...e.payload.doc.data() as object
      }
    })
    console.log('coreSizes',this.coreSizes)

    this.filteredList3.next(this.coreSizes.slice());
    this.listFilterCtrl3.valueChanges
       .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterList3();
       });
});

    this.firestore.collection('projects/'+this.data.projectId+'/workers',ref=>ref.where('designation','in',['driller','helper','others'])).snapshotChanges().subscribe(data => {
      this.workersList= data.map(e => {
        return {
         id: e.payload.doc.id,
         ...e.payload.doc.data() as object
        }
      })

     console.log('this.workersList',this.workersList);


     this.filteredList.next(this.workersList.slice());
        this.listFilterCtrl.valueChanges
           .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterList();
           });
          });

    this.firestore.collection('projects/'+this.data.projectId+'/workers',ref=>ref.where('designation','in',['driller','helper','others'])).snapshotChanges().subscribe(data => {
      this.workersOtherList= data.map(e => {
        return {
         id: e.payload.doc.id,
         ...e.payload.doc.data() as object
        }
      })

     console.log('this.workersOtherList',this.workersOtherList);


     this.filteredList4.next(this.workersOtherList.slice());
        this.listFilterCtrl4.valueChanges
           .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterList4();
           });
          });


    this.firestore.collection('projects/'+this.data.projectId+'/workers',ref=>ref.where('designation','==','driller')).snapshotChanges().subscribe(data => {
      this.drillersList= data.map(e => {
        return {
         id: e.payload.doc.id,
         ...e.payload.doc.data() as object
        }
      })

     console.log('this.drillersList',this.drillersList);


     this.filteredList5.next(this.drillersList.slice());
        this.listFilterCtrl5.valueChanges
           .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterList5();
           });
          });


    this.firestore.collection('projects/'+this.data.projectId+'/workers',ref=>ref.where('designation','==','helper')).snapshotChanges().subscribe(data => {
      this.helpersList= data.map(e => {
        return {
         id: e.payload.doc.id,
         ...e.payload.doc.data() as object
        }
      })

     console.log('this.helpersList',this.helpersList);


     this.filteredList6.next(this.helpersList.slice());
        this.listFilterCtrl6.valueChanges
           .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterList6();
           });
    });

    this.registerForm = this.formBuilder.group({
        id: [],
        entryDate: [],
        task: ['', Validators.required],
        shift: ['', Validators.required],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        workHours: ['', [Validators.required,Validators.min(.00001),Validators.max(12)]],
        worker1: [],
        worker2: [],
        driller: [],
        helper: [],
        startMeter: [],
        endMeter: [],
        coreSize: [],
        comment: [],
        entryBy: [],
    });
    this.firestore.collection('users/',ref=>ref.where('email','==',this.afAuth.auth.currentUser.email)).snapshotChanges().subscribe(data => {
      let user_info=[];
      user_info= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        }
      })
      console.log('user_info', user_info[0]);
    this.registerForm.controls.entryBy.setValue(user_info[0]);
    })
        this.registerForm.controls.entryDate.setValue(new Date());
      if (this.data.item!==undefined) {
        this.registerForm.controls.id.setValue(this.data.item.id);
        this.registerForm.controls.entryBy.setValue(this.data.item.entryBy);
        this.registerForm.controls.entryDate.setValue(new Date(this.data.item.entryDate));
        this.registerForm.controls.task.setValue(this.data.item.task);
        this.registerForm.controls.workHours.setValue(this.data.item.workHours);
        this.registerForm.controls.startMeter.setValue(this.data.item.startMeter);
        this.registerForm.controls.endMeter.setValue(this.data.item.endMeter);
        this.registerForm.controls.worker1.setValue(this.data.item.worker1);
        this.registerForm.controls.worker2.setValue(this.data.item.worker2);
        this.registerForm.controls.driller.setValue(this.data.item.driller);
        this.registerForm.controls.helper.setValue(this.data.item.helper);
        this.registerForm.controls.shift.setValue(this.data.item.shift);
        this.registerForm.controls.startTime.setValue(this.data.item.startTime);
        this.registerForm.controls.endTime.setValue(this.data.item.endTime);
        this.registerForm.controls.coreSize.setValue(this.data.item.coreSize);
        this.registerForm.controls.comment.setValue(this.data.item.comment);
      }
  }


  get f() { return this.registerForm.controls; }

  private filterList() {
    if (!this.workersList) {
      return;
    }
    let search = this.listFilterCtrl.value;
    if (!search) {
      this.filteredList.next(this.workersList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredList.next(
      this.workersList.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1 || bank.lastName.toLowerCase().indexOf(search) > -1)

    );
}
private filterList4() {
  if (!this.workersOtherList) {
    return;
  }
  let search = this.listFilterCtrl4.value;
  if (!search) {
    this.filteredList4.next(this.workersOtherList.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredList4.next(
    this.workersOtherList.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1 || bank.lastName.toLowerCase().indexOf(search) > -1)

  );
}
private filterList5() {
  if (!this.drillersList) {
    return;
  }
  let search = this.listFilterCtrl5.value;
  if (!search) {
    this.filteredList5.next(this.drillersList.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredList5.next(
    this.drillersList.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1 || bank.lastName.toLowerCase().indexOf(search) > -1)

  );
}
private filterList6() {
  if (!this.helpersList) {
    return;
  }
  let search = this.listFilterCtrl6.value;
  if (!search) {
    this.filteredList6.next(this.helpersList.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredList6.next(
    this.helpersList.filter(bank => bank.firstName.toLowerCase().indexOf(search) > -1 || bank.lastName.toLowerCase().indexOf(search) > -1)

  );
}
private filterList2() {
  if (!this.taskList) {
    return;
  }
  let search = this.listFilterCtrl2.value;
  if (!search) {
    this.filteredList2.next(this.taskList.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredList2.next(
    this.taskList.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)

  );
}

private filterList3() {
  if (!this.coreSizes) {
    return;
  }
  let search = this.listFilterCtrl3.value;
  if (!search) {
    this.filteredList3.next(this.coreSizes.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredList3.next(
    this.coreSizes.filter(bank => bank.core.toLowerCase().indexOf(search) > -1)

  );
}

  onSubmit() {

    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }
        let body=
        {
          entryDate:this.datePipe.transform(this.registerForm.controls.entryDate.value, 'yyyy-MM-dd hh:mm:ss a'),
          task: this.registerForm.controls.task.value,
          shift: this.registerForm.controls.shift.value,
          startTime: this.registerForm.controls.startTime.value,
          endTime: this.registerForm.controls.endTime.value,
          workHours:this.registerForm.controls.workHours.value,
          worker1: this.registerForm.controls.worker1.value,
          worker2: this.registerForm.controls.worker2.value,
          driller: this.registerForm.controls.driller.value,
          helper: this.registerForm.controls.helper.value,
          startMeter:this.registerForm.controls.startMeter.value,
          endMeter: this.registerForm.controls.endMeter.value,
          entryBy: this.registerForm.controls.entryBy.value,
          coreSize: this.registerForm.controls.coreSize.value,
          comment: this.registerForm.controls.comment.value
        }
        console.log(body);

        this.firestore.collection('users/',ref=>ref.where('email','==',this.afAuth.auth.currentUser.email)).snapshotChanges().subscribe(data => {
          let user_info=[];
          user_info= data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as object
            }
          })
          console.log('user_info', user_info[0]);

  if (this.registerForm.value.id==null) {
        this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/taskLogs').add(body).then((ref)=>{
          let changedData={
            changeDate:this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss a'),
            changedBy:user_info[0],
            action:'created',
            collectionName:'task logs',
            changedItem:{
                   taskLogs:{
                             id:ref.id,
                             task: this.registerForm.controls.task.value,
                             shift: this.registerForm.controls.shift.value,
                             workHours:this.registerForm.controls.workHours.value,
                             worker1: this.registerForm.controls.worker1.value,
                             worker2: this.registerForm.controls.worker2.value,
                             driller: this.registerForm.controls.driller.value,
                             helper: this.registerForm.controls.helper.value,
                             startMeter:this.registerForm.controls.startMeter.value,
                             endMeter: this.registerForm.controls.endMeter.value,
                             entryBy: this.registerForm.controls.entryBy.value,
                             entryDate: this.datePipe.transform(this.registerForm.controls.entryDate.value, 'yyyy-MM-dd hh:mm:ss a'),
                             startTime: this.registerForm.controls.startTime.value,
                             endTime: this.registerForm.controls.endTime.value,
                             coreSize: this.registerForm.controls.coreSize.value,
                             comment: this.registerForm.controls.comment.value
                           }
                         }
                        }

           this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/activityLogs').add(changedData).then(()=>{
           })
          this.toastrService.success('Record added successfully !', 'Success');
        }).catch((error) => {
          this.toastrService.error(error.message);
        })
    }
    else {
      this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/taskLogs').doc(this.registerForm.value.id).update(body).then(()=>{
       let changedData={
         changeDate:this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss a'),
         changedBy:user_info[0],
         action:'updated',
         collectionName:'task logs',
         changedItem:{
                taskLogs:{
                          id:this.registerForm.value.id,
                          task: this.registerForm.controls.task.value,
                          shift: this.registerForm.controls.shift.value,
                          workHours:this.registerForm.controls.workHours.value,
                          worker1: this.registerForm.controls.worker1.value,
                          worker2: this.registerForm.controls.worker2.value,
                          driller: this.registerForm.controls.driller.value,
                          helper: this.registerForm.controls.helper.value,
                          startMeter:this.registerForm.controls.startMeter.value,
                          endMeter: this.registerForm.controls.endMeter.value,
                          entryBy: this.registerForm.controls.entryBy.value,
                          entryDate: this.datePipe.transform(this.registerForm.controls.entryDate.value, 'yyyy-MM-dd hh:mm:ss a'),
                          startTime: this.registerForm.controls.startTime.value,
                          endTime: this.registerForm.controls.endTime.value,
                          coreSize: this.registerForm.controls.coreSize.value,
                          comment: this.registerForm.controls.comment.value
                        }
                      }
                     }

        this.firestore.collection('projects/'+this.data.projectId+'/worksheet/'+this.data.worksheetId+'/activityLogs').add(changedData).then(()=>{
        })
        this.toastrService.success('Record updated successfully !', 'Success');
      }).catch((error) => {
        this.toastrService.error(error.message);
      })
    }
  })

    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }

  public get_log_task_status(): void {
    let logtype = this.registerForm.controls.task.value.logType;
    console.log("logtype : ",logtype);
    switch (logtype) {
      case 'HC':
        this.registerForm.controls.worker1.setValidators(null);
        this.registerForm.controls.worker2.setValidators(null);
        this.registerForm.controls.driller.setValidators(null);
        this.registerForm.controls.helper.setValidators(null);
        this.registerForm.controls.startMeter.setValidators(null);
        this.registerForm.controls.endMeter.setValidators(null);
      break;

      case 'EH':
        this.registerForm.controls.worker1.setValidators([Validators.required]);
        this.registerForm.controls.worker2.setValidators([Validators.required]);
        this.registerForm.controls.driller.setValidators(null);
        this.registerForm.controls.helper.setValidators(null);
        this.registerForm.controls.startMeter.setValidators(null);
        this.registerForm.controls.endMeter.setValidators(null);
      break;

      case 'EHP':
        this.registerForm.controls.worker1.setValidators([Validators.required]);
        this.registerForm.controls.worker2.setValidators([Validators.required]);
        this.registerForm.controls.startMeter.setValidators([Validators.required,Validators.min(0.00001)]);
        this.registerForm.controls.endMeter.setValidators([Validators.required]);
        this.registerForm.controls.driller.setValidators(null);
        this.registerForm.controls.helper.setValidators(null);
      break;

      case 'XH':
        this.registerForm.controls.driller.setValidators([Validators.required]);
        this.registerForm.controls.helper.setValidators([Validators.required]);
        this.registerForm.controls.worker1.setValidators(null);
        this.registerForm.controls.worker2.setValidators(null);
        this.registerForm.controls.startMeter.setValidators(null);
        this.registerForm.controls.endMeter.setValidators(null);
      break;

      case 'XHP':
        this.registerForm.controls.driller.setValidators([Validators.required]);
        this.registerForm.controls.helper.setValidators([Validators.required]);
        this.registerForm.controls.startMeter.setValidators([Validators.required,Validators.min(0.00001)]);
        this.registerForm.controls.endMeter.setValidators([Validators.required]);
        this.registerForm.controls.worker1.setValidators(null);
        this.registerForm.controls.worker2.setValidators(null);
      break;

      default:
        break;
    }
    this.registerForm.controls.worker1.reset();
    this.registerForm.controls.worker2.reset();
    this.registerForm.controls.driller.reset();
    this.registerForm.controls.helper.reset();
    this.registerForm.controls.startMeter.reset();
    this.registerForm.controls.endMeter.reset();
  }


    public meterToRengeValidate(){
      this.registerForm.controls.startMeter.setValidators([Validators.required,Validators.min(0)]);
      this.registerForm.controls.endMeter.setValidators([Validators.required,Validators.min((this.registerForm.controls.startMeter.value)+(0.00001))]);
      if(this.registerForm.controls.startMeter.value>=this.registerForm.controls.endMeter.value){
        this.registerForm.controls.endMeter.setValue(null);
      }
    }

    assignWorkHours(){
      if (new Date("1970-1-1 " + this.registerForm.controls.endTime.value)<new Date("1970-1-1 " + this.registerForm.controls.startTime.value))
      {
        let hours=( Number(new Date("1970-1-2 " + this.registerForm.controls.endTime.value)) - Number(new Date("1970-1-1 " + this.registerForm.controls.startTime.value)) ) / 1000 / 60 / 60;
        this.registerForm.controls.workHours.setValue(hours);
      }
      else {
        let hours=( Number(new Date("1970-1-1 " + this.registerForm.controls.endTime.value)) - Number(new Date("1970-1-1 " + this.registerForm.controls.startTime.value)) ) / 1000 / 60 / 60;
        this.registerForm.controls.workHours.setValue(hours);
      }



    }

  ngOnDestroy() {
    this._onDestroy.next();
   this._onDestroy.complete();
  }

}
