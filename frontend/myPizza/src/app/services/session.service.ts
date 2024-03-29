import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, map } from 'rxjs';
import { DeliveryTimeRes, IsThereAnActiveSessionRes, StartSessionDTO, TimeIntervalsRes, _Session } from '../Models/i_session';
import { ConfirmRes } from '../Models/confirm-res';

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

  public getDeliveryTimes(): Observable<DeliveryTimeRes> {
    return this.http.get<DeliveryTimeRes>(`${this.backendUrl}/api/work-session/get-delivery-times`)
  }

  public getActiveSessionTimeIntervals(): Observable<TimeIntervalsRes> {
    return this.http.get<TimeIntervalsRes>(`${this.backendUrl}/api/work-session/get-active-session-time-intervals`, { withCredentials: true })
  }

  public closeActiveSession(): Observable<ConfirmRes> {
    return this.http.get<ConfirmRes>(`${this.backendUrl}/api/work-session/close`, { withCredentials: true })
  }

}
