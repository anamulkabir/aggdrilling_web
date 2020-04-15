import { Injectable } from '@angular/core';  
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';  
import { ToastrService } from 'ngx-toastr';
@Injectable({ providedIn: 'root' })  
export class AuthGuard implements CanActivate {  
    constructor(private router: Router,private toastrService: ToastrService) { }  
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {  
        let role=localStorage.getItem('role');
        if (role=='admin'||role=='user'||role=='geologist') {  
            return true;  
        }          
      this.toastrService.error('You must login to access this part.', 'Access denied !'); 
        this.router.navigate(['']);  
        return false;  
    }  
} 