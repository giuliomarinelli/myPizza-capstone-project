import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Message } from '../Models/i-message';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  public messages = new BehaviorSubject<number>(-1)

  public messages$ = this.messages.asObservable()

  private backendUrl = environment.backendUrl

  public setMessageReadById(id: string): Observable<Message> {
    return this.http.get<Message>(`${this.backendUrl}/api/user-profile/message/${id}/set-read`, { withCredentials: true })
  }

}
