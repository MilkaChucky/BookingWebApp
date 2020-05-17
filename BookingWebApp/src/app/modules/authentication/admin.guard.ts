import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from './services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const isAuthenticated = this.authenticationService.isAuthAndAdmin();
        if (isAuthenticated) {
            return isAuthenticated;
        } else {
            this.router.navigate(['/home']);
            return false;
        }
    }
}