import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    public user;
    private listTitles: any[];
    location: Location;
      mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;

    constructor(location: Location,  private element: ElementRef, private router: Router,public afAuth: AngularFireAuth,
      private toastrService: ToastrService) {
      this.location = location;
          this.sidebarVisible = false;
    }

    ngOnInit(){
      this.user=localStorage.getItem("userName");
      this.listTitles = ROUTES.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    //   this.router.events.subscribe((event) => {
    //     this.sidebarClose();
    //      var $layer: any = document.getElementsByClassName('close-layer')[0];
    //      if ($layer) {
    //        $layer.remove();
    //        this.mobile_menu_visible = 0;
    //      }
    //  });
    }
    public logout() {     
        Swal.fire({
          title: 'Are you sure?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, log out!'
        }).then((result) => {
          if (result.value) {
            localStorage.clear();
            this.router.navigate(['']);  
          }
        })
      }

    
      public  passwordChange() {
        let email=this.afAuth.auth.currentUser.email;
        let pass;
        Swal.mixin({
          input: 'text',
          confirmButtonText: 'Next &rarr;',
          showCancelButton: true,
          progressSteps: ['1', '2', '3']
        }).queue([
          {
            title: 'Enter your old password',
          input: 'password',
          inputPlaceholder: 'Enter your old password',
         inputValidator: (value) => {
          return new Promise((resolve) => {
            this.afAuth.auth.signInWithEmailAndPassword(email,value).then((result) => {
              resolve();
            })
            .catch((error) => {
              resolve(error.message)
            })
          })
        }         
        },
          {
            title: 'Enter your new password',
          input: 'password',
          inputPlaceholder: 'Enter your password',
         inputValidator: (value) => {
          pass=value;
          return new Promise((resolve) => {
            if (value.length >=6) {
              resolve()
            } else {
              resolve('Password must be at least 6 characters !!!')
            }
          })
        }         
        },
        {
          title: 'Confirm your new password',
        input: 'password',
        inputPlaceholder: 'Confirm your password',
       inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value===pass) {
            resolve()
          } else {
            resolve("Passwords doesn't match !!!")
          }
        })
      }         
      }
        ]).then((result) => {
          if (result.value) {
            return this.afAuth.auth.currentUser.updatePassword(pass)
                .then(() => {
                  this.toastrService.success('Password updated successfully','Success');
                  Swal.fire({
                    title: 'Success!',
                    html: `
                    Your password has been updated successfully.
                    `,
                    confirmButtonText: 'Ok!'
                  })
                }).catch((error) => {
                  this.toastrService.error(error,'Failed !');
                })
           }
        })
      }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { //asign a function
              body.classList.remove('nav-open');
              this.mobile_menu_visible = 0;
              $layer.classList.remove('visible');
              setTimeout(function() {
                  $layer.remove();
                  $toggle.classList.remove('toggled');
              }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    // getTitle(){
    //   var titlee = this.location.prepareExternalUrl(this.location.path());
    //   if(titlee.charAt(0) === '#'){
    //       titlee = titlee.slice( 1 );
    //   }

    //   for(var item = 0; item < this.listTitles.length; item++){
    //       if(this.listTitles[item].path === titlee){
    //           return this.listTitles[item].title;
    //       }
    //   }
    //   return 'Dashboard';
    // }
}
