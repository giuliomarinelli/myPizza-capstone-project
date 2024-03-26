import { IsLoggedIn } from './../Models/is-logged-in';
import { error } from 'console';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of, single, skipWhile, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { check } from '@igniteui/material-icons-extended';
import { resolve } from 'path';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard {

  constructor(private authSvc: AuthService, private router: Router) {

  }

  isLoggedIn!: boolean
  previousState!: RouterStateSnapshot | null

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {



    return this.authSvc.isLoggedInQuery().pipe(map(res => {
      if (res.loggedIn === true) {
        return true
      }
      return false
    }),
      catchError(err => {
        this.router.navigate(['/login'], { queryParams: { ref: btoa(state.url) } })
        return of(false)
      })
    )

    // let res = false

    // const _state = state

    // console.log(this.previousState)


    // let canAct!: Promise<boolean>

    if (state.url === this.previousState?.url) {
      this.authSvc.previousState.next(state)
      return new Promise<boolean>((resolve) => resolve(true))
    } else {
      console.log('request')
      this.authSvc.previousState.next(state)
      return this.authSvc.isLoggedInCheck()
    }

    // return new Observable<boolean>(obs => {

    //   if (state.url === this.previousState?.url) {
    //     this.authSvc.previousState.next(state)
    //     obs.next(true)
    //   } else {
    //   this.authSvc.isLoggedIn$.subscribe(isLogged => {
    //     if (isLogged) {
    //       this.authSvc.previousState.next(state)
    //       obs.next(true)
    //     } else {
    //       this.authSvc.isLoggedInQuery().pipe(single()).subscribe({
    //         next: res => {
    //           this.authSvc.loggedInSbj.next(true)
    //           this.authSvc.previousState.next(state)
    //           obs.next(true)

    //         },
    //         error: err => {
    //           this.authSvc.previousState.next(state)
    //           obs.next(false)
    //           this.router.navigate(['/login'], { queryParams: { ref: btoa(state.url) } })
    //         }
    //       })
    //     }
    //   })

    // }



    // })








  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true
  }

}
