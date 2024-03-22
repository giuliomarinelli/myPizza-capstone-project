import { IsThereAnActiveSessionRes, _Session } from './../../../Models/i_session';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID, afterNextRender } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { SocketService } from '../../../services/socket.service';
import { Message, MessageMng } from '../../../Models/i-message';
import { SessionService } from '../../../services/session.service';
import { Router } from '@angular/router';
import { Order } from '../../../Models/i-order';


@Component({
  selector: 'app-sessione',
  templateUrl: './sessione.component.html',
  styleUrl: './sessione.component.scss'
})
export class SessioneComponent {

  constructor(private authSvc: AuthService, private productSvc: ProductService,
    @Inject(PLATFORM_ID) private platformId: string, private socket: SocketService,
     private appRef: ApplicationRef, private _session: SessionService, private router: Router,
    private ngZone: NgZone ) {

    afterNextRender(() => {

      this.authSvc.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.authSvc.isAdmin$.subscribe(isAdmin => {
            if (isAdmin) {

              this.res = true
              _session.isThereAnActiveSession().subscribe(res => {
                console.log('sess', res)
                this.isThereAnActiveSession = res
                if (res === true) {
                  this.setSocket()
                } else {
                   ngZone.run(() => router.navigate(['my-pizza-ges/sessione/configura-nuova-sessione']))
                }
              })

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

  protected isLoading: boolean = true

  protected res: boolean = false

  protected isThereAnActiveSession!: boolean

  private onlyOnce: boolean = true

  protected isAdmin: boolean = false

  protected removing = false;

  protected realTimeMessages: MessageMng[] = []

  protected __session!: _Session

  protected orderToString(order: Order): string {
    let str: string = `<h6><strong>Ordine ${order.id}: </strong></h6><p>`
    let c = 0
    order.orderSets.forEach((os, i) => {
      if (i === 0) str += '<p><em>'
      if (i < 3) {
        str += `${os.quantity} x ${os.productRef.name}`
        if (i < 2 && i < order.orderSets.length - 1) str += ', '
      }
      if (i === 2 && i < order.orderSets.length - 1)
        str += '...'
    })
    str += '</em></p>'
    return str
  }

  protected calctTotalAmount(order: Order): string {
    return (order.orderSets.map(os => os.productRef.price).reduce((c, p) => c + p) + order.deliveryCost).toFixed(2) + '€'
  }

  private setSocket(): void {
    if (!this.onlyOnce) return
    this.onlyOnce = false
    this.socket.restoreWorkSession().subscribe(ack => console.log(ack))
    this.socket.OnActiveSessionChange().subscribe(sess => {
      this.__session = sess
      console.log(sess)
    })
    this.socket.onReceiveMessage().subscribe(res => {
      this.isLoading = false

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


