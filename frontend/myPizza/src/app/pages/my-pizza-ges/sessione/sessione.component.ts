import { User } from './../../../Models/i-user';
import { IsThereAnActiveSessionRes, TimeInterval, _Session } from './../../../Models/i_session';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID, afterNextRender } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { SocketService } from '../../../services/socket.service';
import { Message, MessageMng } from '../../../Models/i-message';
import { SessionService } from '../../../services/session.service';
import { NavigationEnd, Router } from '@angular/router';
import { Order } from '../../../Models/i-order';
import { MessageService } from '../../../services/message.service';


@Component({
  selector: 'app-sessione',
  templateUrl: './sessione.component.html',
  styleUrl: './sessione.component.scss'
})
export class SessioneComponent {

  constructor(private authSvc: AuthService, private productSvc: ProductService,
    @Inject(PLATFORM_ID) private platformId: string, private socket: SocketService,
    private appRef: ApplicationRef, private _session: SessionService, private router: Router,
    private ngZone: NgZone, private messageSvc: MessageService) {

    afterNextRender(() => {
      if (localStorage != undefined) {
        const mustRefresh = localStorage.getItem('refresh')
        if (mustRefresh) {
          localStorage.removeItem('refresh')
          location.href = location.href
        } else {
          localStorage.setItem('refresh', 'must-refresh')
        }
      }
      router.events.subscribe(e => {
        if (e instanceof NavigationEnd) this.setSocket()
      })

      this.authSvc.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.isLoggedIn = true
          this.authSvc.isAdmin$.subscribe(isAdmin => {
            if (isAdmin) {

              this.setSocket()
              this.isLoading = false
              this.res = true

              _session.isThereAnActiveSession().subscribe(res => {
                this._session.getActiveSessionTimeIntervals().subscribe(res => {
                  this.timeIntervals = res.timeIntervals
                  console.log(res)
                })
                this.isThereAnActiveSession = res
                if (!res) ngZone.run(() => router.navigate(['my-pizza-ges/sessione/configura-nuova-sessione']))

              })

              console.log('accesso admin concesso')
              this.isAdmin = true


            } else {
              this.isLoading = false
              this.res = true
            }
          })
        } this.isLoading = false
      })

    })
  }

  protected timeIntervals: TimeInterval[] = []

  protected messageIds: string[] = []

  protected setSocket(): void {

    this.socket.restoreTimeIntervals().subscribe(ack => {
      console.log(ack)
    })
    this.socket.onTimeIntervalsChange().subscribe(ti => {
      this.timeIntervals = ti
      this.appRef.tick()
    })

    // per accesso negato chiamata diretta a is admin senza subject e redirect
    /* mancano
      - rifiuta ordine
      - conferma completamento ordine
      - dropdown notifiche con ultime 3 notifiche
      - message by id con controllo su autorizzazione
      - all messages con possibilità di contrassegnare come letto
      - storico ordini client
      - storico ordini admin
      - server exception handling e validation
      - not logged e accesso negato
      - home con slider
      - ordina con login/registrati
      -eliminare la nostra pizzeria e il nostro menu
      - notifiche via mail
      - sistemare registrazione
      - crud profilo
      -impostazioni globali

    7 GIORNI

    */


    this.socket.onReceiveMessage().subscribe(message => {
      if (!this.messageIds.includes(message.id)/* && (message.recipientUser).... admin user id escludi i messaggi con order CONFIRMED */) {
        this.messageIds.push(message.id)
        this.realTimeMessages.unshift({

          message,
          add: true,
          delete: false
        })

        this.appRef.tick()
      }
    })
  }

  ngAfterContentInit() {

  }

  protected finalizeOrder(orderId: string, act: string, messageId: string, i: number): void {
    switch (act) {
      case 'CONFIRM':
      case 'DELETE':
        break
      default: return
    }

    this.appRef.tick()
    this.realTimeMessages.splice(i, 1)
    this.ngZone.runOutsideAngular(() => this.router.navigate(
      ['my-pizza-ges/sessione/finalizza-ordine'],
      { queryParams: { order_id: orderId, act, message_id: messageId } }
    ))





  }

  protected isLoggedIn: boolean = false

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


