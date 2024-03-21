import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, map } from 'rxjs';
import { IsThereAnActiveSessionRes, StartSessionDTO, _Session } from '../Models/i_session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) { }

  private backendUrl = environment.backendUrl

  public isThereAnActiveSession(): Observable<boolean> {
    return this.http.get<IsThereAnActiveSessionRes>(`${this.backendUrl}/api/work-session/is-there-an-active-session`)
      .pipe(map(res => res.thereAnActiveSession))
  }

  public startNewSession(startSessionDTO: StartSessionDTO): Observable<_Session> {
    return this.http.post<_Session>(`${this.backendUrl}/api/work-session/start-new-session`, startSessionDTO, { withCredentials: true })
  }

}
