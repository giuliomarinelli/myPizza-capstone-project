import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client'
import { AuthService } from './auth.service';



const socket: Socket = io('http://localhost:8085', {
  withCredentials: true,
  transports: ['websocket'],
  reconnection: false,
  autoConnect: false
})




@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private authSvc: AuthService) { }

  private socket!: Socket

  public connectSbj = new BehaviorSubject<boolean>(false)
  public isConnected$ = this.connectSbj.asObservable()

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







}
