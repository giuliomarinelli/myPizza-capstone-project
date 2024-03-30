import { environment } from './../../environments/environment.production';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client'
import { AuthService } from './auth.service';
import { Message, MessageDTO } from '../Models/i-message';
import { PublicApiService } from './public-api.service';
import { TimeInterval, _Session } from '../Models/i_session';




const socket: Socket = io(`${environment.backendUrl}`, {
  withCredentials: true,
  transports: ['websocket'],
  reconnection: false,
  autoConnect: false,
  protocols: ['http']
})

// const socketGuest = io('http://localhost:8085', {
//   withCredentials: true,
//   transports: ['websocket'],
//   reconnection: false,
//   autoConnect: false,
//   query: { 'guest': true }
// })




@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private publicApi: PublicApiService, private authSvc: AuthService) {
    publicApi.getAdminUserId().subscribe(res => this.adminUserId = res)
  }

  private messageSentPending: MessageDTO[] = []

  private adminUserId!: string
  private socket!: Socket

  public connectSbj = new BehaviorSubject<boolean>(false)
  public isConnected$ = this.connectSbj.asObservable()

  public get connected(): boolean {
    return socket.connected
  }


  public connect(): void {
    socket.connect()
    socket.on('connect', () => {
      this.messageSentPending.forEach(m => this.sendMessage(m).subscribe(ack => undefined))
    })
    socket.on('connect', () => console.log('connect'))
    socket.on('connect_error', () => {
      console.log('socket disconnesso, verifico l\'autenticazione e eventualmente faccio il refresh, poi mi riconnetto')
      this.authSvc.isWsAuthValidOrRefresh().subscribe({
        next: res => {
          socket.connect()
        }
      })

    })
    socket.on('disconnect', () => {
      console.log('socket disconnesso, verifico l\'autenticazione e eventualmente faccio il refresh, poi mi riconnetto')
      this.authSvc.isWsAuthValidOrRefresh().subscribe({
        next: res => {
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

  restoreAllMessages(): Observable<Object> {
    return new Observable<Object>(observer => {
      socket.emit('restore_all_messages', (ack: Object) => observer.next(ack))
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
      console.log('socket connesso')
    })

  }

  public setOff(): void {
    socket.off('messsage')
    socket.off('unread_messages_count')
    socket.off('time_intervals')
  }

  public onReceiveMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      socket.on('message', (data: Message) => {
        observer.next(data)
      })
    })
  }

  public onGetUnreadMessagesCount(): Observable<number> {
    return new Observable<number>(observer => {
      socket.on('unread_messages_count', ((count: number) => observer.next(count)))
    })
  }

  public getUnreadMessagesCount(): Observable<string> {
    return new Observable<string>(observer => {
      socket.emit('get_unread_messages_count', {}, (ack: string) => observer.next(ack))
    })
  }

  public sendMessage(messageDTO: MessageDTO): Observable<string> {
    return new Observable<string>(observer => {
      socket.on('disconnect', () => this.messageSentPending.push(messageDTO))
      socket.emit('messageSendToUser', {
        ...messageDTO
      }, function (ack: string) {
        observer.next(ack)
      })

    })

  }



}








