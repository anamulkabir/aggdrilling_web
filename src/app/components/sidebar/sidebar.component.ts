import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    role: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/user', title: 'Users',  icon:'person', class: '', role: 'admin' },
    { path: '/workers', title: 'Workers',  icon:'people', class: '', role: 'admin' },
    { path: '/geologists', title: 'Geologists',  icon:'supervised_user_circle', class: '', role: 'admin' },
    { path: '/equipments', title: 'Equipments',  icon:'gavel', class: '', role: 'admin' },
    { path: '/tasks', title: 'Tasks',  icon:'list_alt', class: '', role: 'admin' },
    { path: '/rigs', title: 'Rigs',  icon:'style', class: '', role: 'admin' },
    { path: '/core-sizes', title: 'Core Sizes',  icon:'format_size', class: '', role: 'admin' },
    { path: '/materials', title: 'Materials',  icon:'category', class: '', role: 'admin' },
    { path: '/unitdefinition', title: 'Unit Definition',  icon:'poll', class: '', role: 'admin' },
    { path: '/projects', title: 'Projects',  icon:'assignment', class: '', role: 'admin' },
    { path: '/project-steps', title: 'Project Steps',  icon:'account_tree', class: '', role: 'admin' },
    

    { path: '/projects', title: 'Projects',  icon:'assignment', class: '', role: 'user' },


    { path: '/projects', title: 'Projects',  icon: 'assignment', class: '', role: 'geologist' }
    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public user;
  public role;
  menuItems: any[];

  constructor(public router:Router) { }

  ngOnInit() {
    this.user=localStorage.getItem("userName");
    this.role=localStorage.getItem("role");
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

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
   
}
