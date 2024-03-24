import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInVariantGuard {

  constructor(private authSvc: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable<boolean>(obs => {
      this.authSvc.isLoggedIn$.subscribe(isLogged => {
        if (isLogged) {
          obs.next(true)
        } else {
          this.authSvc.isLoggedInQuery().pipe(take(1)).subscribe({
            next: res => {
              this.authSvc.loggedInSbj.next(true)
              obs.next(true)

            },
            error: err => {
              obs.next(false)
              this.router.navigate(['/loading'])
            }
          })
        }
      })
    })
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

}
