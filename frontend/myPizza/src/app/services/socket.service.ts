import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client'
import { AuthService } from './auth.service';
import { Message } from '../Models/i-message';



const socket: Socket = io('http://localhost:8085', {
  withCredentials: true,
  transports: ['websocket'],
  reconnection: false,
  autoConnect: false,
  query: {'guest': false}
})

const socketGuest = io('http://localhost:8085', {
  withCredentials: true,
  transports: ['websocket'],
  reconnection: false,
  autoConnect: false,
  query: {'guest': true}
})




@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private authSvc: AuthService) { }

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

  public sendMessage(): void {
    socket.emit('messageSendToUser', {
      recipientUserId: "b46bf3ca-9a56-4cfa-aeee-5e8b5eb67efc",
      message: "ciao"
    }, function (ack: any) {
      console.log(ack)
    })
  }



}








