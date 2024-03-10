import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IsLoggedIn } from '../Models/is-logged-in';
import { UserLogin } from '../Models/user-dto';
import { ConfirmRes } from '../Models/confirm-res';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public loggedInSbj = new BehaviorSubject<boolean>(false)
  public isLoggedIn$ = this.loggedInSbj.asObservable()

  private backendUrl = environment.backendUrl;

  public isLoggedInQuery(): Observable<IsLoggedIn> {
    return this.http.get<IsLoggedIn>(`${this.backendUrl}/api/user-profile/is-logged-in`, { withCredentials: true })
  }

  public login(data: UserLogin): Observable<ConfirmRes> {
    return this.http.post<ConfirmRes>(`${this.backendUrl}/auth/login`, data, { withCredentials: true })
  }

  public logout(): Observable<ConfirmRes> {
    return this.http.get<ConfirmRes>(`${this.backendUrl}/auth/logout`, { withCredentials: true })
  }

}
