import { Component, Inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { SocketService } from '../../../services/socket.service';
import { Message, MessageMng } from '../../../Models/i-message';


@Component({
  selector: 'app-sessione',
  templateUrl: './sessione.component.html',
  styleUrl: './sessione.component.scss'
})
export class SessioneComponent {

  constructor(private authSvc: AuthService, private productSvc: ProductService,
    @Inject(PLATFORM_ID) private platformId: string, private socket: SocketService) {

    afterNextRender(() => {
      this.authSvc.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn && this.onlyOnce) {
          this.authSvc.isAdmin$.subscribe(isAdmin => {
            if (isAdmin) {
              console.log('accesso admin concesso')
              this.isAdmin = true
            } else {
              console.log('accesso negato, miss permissions')
            }
          })
        } else (console.log('accesso negato: non loggato'))
      })

    })
  }

  private onlyOnce: boolean = true

  protected isAdmin: boolean = false

  protected removing = false;

  protected realTimeMessages: MessageMng[] = []



  protected removeMessage(i: number) {
    this.realTimeMessages[i].delete = true
    setTimeout(() => {

      this.realTimeMessages.splice(i, 1)
    }, 500)
  }

  ngDoCheck() {
    if (this.onlyOnce && this.isAdmin) {
      this.onlyOnce = false
      this.socket.connect()
      this.socket.onConnect().subscribe(res => console.log(res))
      this.socket.onReceiveMessage().subscribe(res => {
       this.realTimeMessages.unshift({
        message: res,
        add: true,
        delete: false
       })
      })
    }


  }
}


