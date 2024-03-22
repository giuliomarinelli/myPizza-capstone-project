import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client'
import { AuthService } from './auth.service';
import { Message, MessageDTO } from '../Models/i-message';
import { PublicApiService } from './public-api.service';
import { TimeInterval, _Session } from '../Models/i_session';



const socket: Socket = io('http://localhost:8085', {
  withCredentials: true,
  transports: ['websocket'],
  reconnection: false,
  autoConnect: false,
  query: { 'guest': false }
})

const socketGuest = io('http://localhost:8085', {
  withCredentials: true,
  transports: ['websocket'],
  reconnection: false,
  autoConnect: false,
  query: { 'guest': true }
})




@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private publicApi: PublicApiService, private authSvc: AuthService) {
    publicApi.getAdminUserId().subscribe(res => this.adminUserId = res)
  }

  private adminUserId!: string
  private socket!: Socket

  public connectSbj = new BehaviorSubject<boolean>(false)
  public isConnected$ = this.connectSbj.asObservable()

  public get connected(): boolean {
    return socket.connected
  }

  public connect(): void {
    socket.connect()
    socket.on('connect_error', (err) => {
      console.log('errore di connessione, verifico l\'autorizzazione e se l\'access token è scaduto, faccio il refresh e ritento la connessione')
      this.authSvc.isWsAuthValidOrRefresh().subscribe(res => {
        console.log(res)
        if (res.valid === false) {
          console.log('refresh impossibile, bisogna rifare il login')
        } else {
          console.log('refresh fatto, ritento la connessione')
          socket.connect()
        }
      })
    })
  }

  onTimeIntervalsChange(): Observable<TimeInterval[]> {
    return new Observable<TimeInterval[]>(observer => {
      socket.on('time_intervals', (data: TimeInterval[]) => {
        observer.next(data)
      })
    })
  }


  restoreTimeIntervals(): Observable<Object> {
    return new Observable<Object>(observer => {
      socket.emit('restore_time_intervals', {
        restore: true
      },
        (ack: Object) => {
          observer.next(ack)
        })
    })
  }

  restoreMessages(): Observable<string> {
    return new Observable<string>(observer => {
      socket.emit('restore_messages', {
        restore: true
      }, function (ack: string) {
        observer.next(ack)
      })
    })
  }


  public onConnect(): Observable<string> {
    return new Observable<string>(observer => {
      socket.on('connection_ok', (data: string) => {
        observer.next(data);
      })
      console.log('connesso')
    })

  }

  public onReceiveMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      socket.on('message', (data: Message) => {
        observer.next(data);
      })
    })
  }

  public sendMessage(messageDTO: MessageDTO): Observable<string> {
    return new Observable<string>(observer => {
      socket.emit('messageSendToUser', {
        ...messageDTO
      }, function (ack: string) {
        observer.next(ack)
      })
    })

  }



}








