import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IsLoggedIn } from '../Models/is-logged-in';
import { UserLogin, UserPostDTO } from '../Models/user-dto';
import { ConfirmRes } from '../Models/confirm-res';
import { Address, AddressesRes, AuthoritiesRes, User } from '../Models/i-user';
import { IsWsAuthValid } from '../Models/i-IsWsAuthValid';
import { isPlatformBrowser } from '@angular/common';
import { error } from 'console';
import { HttpErrorRes } from '../Models/i-http-error-res';
import { RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: string) { }

  public loggedInSbj = new BehaviorSubject<boolean>(false)
  public isLoggedIn$ = this.loggedInSbj.asObservable()

  public adminSbj = new BehaviorSubject<boolean>(false) // sono buggati, da rimuovere
  public isAdmin$ = this.adminSbj.asObservable()

  public isUserAdmin = new BehaviorSubject<boolean>(false)
  public isUserAdmin$ = this.isUserAdmin.asObservable()

  private backendUrl = environment.backendUrl;

  public previousState = new BehaviorSubject<RouterStateSnapshot | null>(null)
  public previousState$ = this.previousState.asObservable()


  public async isLoggedInCheck(): Promise<boolean> {


    let isLoggedIn: boolean = false
    const res = await fetch(`${this.backendUrl}/api/user-profile/is-logged-in`, { credentials: 'include' })
    const data: IsLoggedIn | HttpErrorRes = await res.json()
    if (res.status === 200) {
      const OkRes: IsLoggedIn = <IsLoggedIn>data
      if (OkRes.loggedIn) isLoggedIn = true
    } else if (res.status === 401) {
      const errRes: HttpErrorRes = <HttpErrorRes>data
      if (errRes.error === 'Unauthorized') isLoggedIn = false
    }
    return isLoggedIn

  }

  public isLoggedInQuery(): Observable<IsLoggedIn> {
    return this.http.get<IsLoggedIn>(`${this.backendUrl}/api/user-profile/is-logged-in`, { withCredentials: true })
  }

  public login(data: UserLogin): Observable<ConfirmRes> {
    return this.http.post<ConfirmRes>(`${this.backendUrl}/auth/login`, data, { withCredentials: true })
  }

  public logout(): Observable<ConfirmRes> {
    return this.http.get<ConfirmRes>(`${this.backendUrl}/auth/logout`, { withCredentials: true })
  }

  public register(userPostDTO: UserPostDTO): Observable<User> {
    return this.http.post<User>(`${this.backendUrl}/auth/register`, userPostDTO)
  }

  public getProfile(): Observable<User> {
    return this.http.get<User>(`${this.backendUrl}/api/user-profile`, { withCredentials: true })
  }

  public isAdmin(): Observable<boolean> {
    return this.http.get<AuthoritiesRes>(`${this.backendUrl}/api/user-profile/get-authorities`, { withCredentials: true }).pipe(map(res => {
      if (res.authorities.includes('ADMIN')) return true
      return false
    }))
  }

  public isWsAuthValidOrRefresh(): Observable<IsWsAuthValid> {
    return this.http.get<IsWsAuthValid>(`${this.backendUrl}/ws/is-ws-auth-valid-or-refresh`, { withCredentials: true })
  }

  public getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.backendUrl}/api/user-profile/addresses`, { withCredentials: true })
  }

  public getAuthorities(): Observable<string[]> {
    return this.http.get<AuthoritiesRes>(`${this.backendUrl}/api/user-profile/get-authorities`, { withCredentials: true }).pipe(map(res => res.authorities))
  }

}
