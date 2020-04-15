import { Injectable } from '@angular/core';  
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';  
import { ToastrService } from 'ngx-toastr';
@Injectable({ providedIn: 'root' })  
export class AuthGuard2 implements CanActivate {  
    constructor(private router: Router,private toastrService: ToastrService) { }  
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {  
        let role=localStorage.getItem('role');
        if (role=='admin') {  
            return true;  
        } 
      this.toastrService.error('This part has only access to admin.', 'Access denied !'); 
        this.router.navigate(['']);  
        return false;  
    }  
} 