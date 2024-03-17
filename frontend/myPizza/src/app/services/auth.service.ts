import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IsLoggedIn } from '../Models/is-logged-in';
import { UserLogin, UserPostDTO } from '../Models/user-dto';
import { ConfirmRes } from '../Models/confirm-res';
import { AuthoritiesRes, User } from '../Models/i-user';
import { IsWsAuthValid } from '../Models/i-IsWsAuthValid';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public loggedInSbj = new BehaviorSubject<boolean>(false)
  public isLoggedIn$ = this.loggedInSbj.asObservable()

  public adminSbj = new BehaviorSubject<boolean>(false)
  public isAdmin$ = this.adminSbj.asObservable()

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

}
