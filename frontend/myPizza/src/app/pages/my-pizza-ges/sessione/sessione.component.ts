import { ApplicationRef, Component, Inject, PLATFORM_ID, afterNextRender } from '@angular/core';
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
    @Inject(PLATFORM_ID) private platformId: string, private socket: SocketService, private appRef: ApplicationRef) {

    afterNextRender(() => {
      this.setSocket()
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

  private setSocket(): void {
    if (!this.onlyOnce) return
    this.onlyOnce = false
    this.socket.onReceiveMessage().subscribe(res => {


      this.realTimeMessages.unshift({

        message: res,
        add: true,
        delete: false
      })

      this.appRef.tick()
    })
  }


  protected removeMessage(i: number) {
    this.realTimeMessages[i].delete = true
    this.appRef.tick()
    setTimeout(() => {
      this.realTimeMessages.splice(i, 1)
      this.appRef.tick()
    }, 500)
  }

  protected trigger = 0


}


