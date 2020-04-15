import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-activity-log-details-modal',
  templateUrl: './activity-log-details-modal.component.html',
  styleUrls: ['./activity-log-details-modal.component.scss']
})
export class ActivityLogDetailsModalComponent implements OnInit {
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<ActivityLogDetailsModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }
  item=this.data.item.taskLogs;
  ngOnInit() { 
    console.log(this.data.item.taskLogs);
  }
 
}
