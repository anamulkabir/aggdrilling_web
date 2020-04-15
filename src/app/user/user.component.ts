import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material';
import { UserCreateModalComponent } from 'app/modals/user-create-modal/user-create-modal.component';
import Swal from 'sweetalert2';
import { UserUpdateModalComponent } from 'app/modals/user-update-modal/user-update-modal.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public userList;
  p=1;
  termUser;
  total;
  constructor(private firestore:AngularFirestore,public router:Router,public afAuth: AngularFireAuth,
    public dialog: MatDialog,private toastrService: ToastrService){}

  ngOnInit() {
    this.firestore.collection('users').snapshotChanges().subscribe(data => {
      this.userList= data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as object
        } 
      })
      console.log('this.userList',this.userList);
    });
  }
  
  paginationStart(){
    this.p=1;
  }
  openDialog() {
    this.dialog.open(UserCreateModalComponent);
   }
   editDialog(item) {
      this.dialog.open(UserUpdateModalComponent, {
       data: {
         item: item
       },
       position:{
         top:'50px'
       }
     });
   }


   go_to_assign_project_permition(item){
    this.router.navigate(['/user/'+item.id]);
  }

   forgotPassword(email) {
    Swal.fire({
      title: 'Are you sure ?',
      text: "A mail will be sent to this user to reset password.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, send mail'
    }).then((result) => {
      if (result.value) {
        return this.afAuth.auth.sendPasswordResetEmail(email)
        .then(() => {
          this.toastrService.success('Password reset email sent, check your email inbox.','Mail Sent');
        }).catch((error) => {
          this.toastrService.error(error,'Failed !');
        })
      }
    })
  }

statusToogoleChangeForUser(item,e) {
    
  if(e.checked){
    let body={
      isActive: true
    }
    this.firestore.collection('users/').doc(item.id).update(body).then(()=>{
      this.toastrService.success('Record updated successfully !', 'Success');
    }).catch((error) => {
      this.toastrService.error(error.message);
    }) 
  
 
  }
  else{
    let body={
        isActive: false
    }
    this.firestore.collection('users/').doc(item.id).update(body).then(()=>{
      this.toastrService.success('Record updated successfully !', 'Success');
    }).catch((error) => {
      this.toastrService.error(error.message);
    }) 
  }
}
  
}
