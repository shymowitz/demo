import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {CommonService} from '../../cio-cs/gss/services/common.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!CommonService.isTokenExpired() ) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        window.location.replace(environment.loginUrl); 
        return false;
    }
}