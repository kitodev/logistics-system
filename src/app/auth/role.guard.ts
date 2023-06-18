import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { RoleData } from '../logon-app-routing.module';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const routeData: RoleData = route.data as RoleData;
    if (
      routeData?.roles &&
      routeData.roles?.length &&
      this.authService.hasAnyRole(routeData.roles)
    ) {
      return true;
    } else {
      if (routeData.redirect) {
        return this.router.createUrlTree([routeData.redirect]);
      }
      return false;
    }
  }
}
