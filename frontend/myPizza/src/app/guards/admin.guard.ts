import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, single, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {

  constructor(private authSvc: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Observable(obs => {
      this.authSvc.isAdmin$.subscribe(isAdmin => {
        if (isAdmin) {
          obs.next(true)
        } else {
          this.authSvc.isLoggedInQuery().pipe(single(res => true)).subscribe({next: res => {
            this.authSvc.getAuthorities().subscribe(auth => {
              if (auth.includes('ADMIN')) {
                this.authSvc.adminSbj.next(true)
                obs.next(true)
              } else {
                this.router.navigate(['/forbidden'])
                obs.next(false)
              }
            })
          }})
        }
      })

    })


  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state)
  }

}
