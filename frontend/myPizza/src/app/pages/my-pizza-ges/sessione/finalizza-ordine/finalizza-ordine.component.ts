import { Message, MessageDTO } from './../../../../Models/i-message';
import { IsThereAnActiveSessionRes, TimeInterval } from './../../../../Models/i_session';
import { ApplicationRef, Component, NgZone, afterNextRender } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { SocketService } from '../../../../services/socket.service';
import { SessionService } from '../../../../services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ConfirmOrderDTO, Order } from '../../../../Models/i-order';
import { OrderService } from '../../../../services/order.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '../../../../services/message.service';


@Component({
  selector: 'app-finalizza-ordine',
  templateUrl: './finalizza-ordine.component.html',
  styleUrl: './finalizza-ordine.component.scss'
})
export class FinalizzaOrdineComponent {

  constructor(private authSvc: AuthService, private socket: SocketService, private _session: SessionService,
    private ngZone: NgZone, private route: ActivatedRoute, private router: Router, private orderSvc: OrderService,
    private appRef: ApplicationRef, private fb: FormBuilder, private messageSvc: MessageService
  ) {

    afterNextRender(() => {

              this.route.queryParams.subscribe(params => {
                let valid: boolean = true
                const orderId = <string>params['order_id']
                this.orderId = orderId
                const act = <string>params['act']
                this.act = act
                const messageId = <string>params['message_id']
                this.messageId = messageId
                // validazione
                const regex = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/)
                valid = regex.test(orderId)
                if (!(act === 'DELETE' || act === 'CONFIRM' || act === 'SET_COMPLETED')) valid = false
                if (!valid) ngZone.run(() => router.navigate(['my-pizza-ges', 'sessione']))
                if (valid)
                  orderSvc.getOrderById(orderId).subscribe({
                    next: res => {
                      this.order = res
                      _session.isThereAnActiveSession().subscribe(res => {
                        this.isThereAnActiveSession = res
                        this.isLoading = false
                        if (!res) {
                          ngZone.run(() => router.navigate(['/sessione']))
                        } else {
                          _session.getActiveSessionTimeIntervals().subscribe({
                            next: res => {
                              console.log(res)
                              this.timeIntervals = res.timeIntervals
                              this.res1 = true

                              appRef.tick()
                            },
                            error: err => {

                              this.error = true
                              console.log(err)
                            }
                          })
                        }
                      })
                      console.log(res)
                    },
                    error: err => {
                      this.error = true
                      this.isLoading = false
                      appRef.tick()
                      console.log('res error', this.error)
                    }
                  })

              })



    })
  }

  protected messageId: string = ''

  protected confirm: boolean = false

  protected timeIntervals: TimeInterval[] = []

  protected isThereAnActiveSession: boolean = false

  protected res: boolean = false

  protected res1: boolean = false

  protected isAdmin: boolean = false

  protected isLoading: boolean = true

  protected order!: Order

  protected error = false

  protected orderId: string | null = null

  protected act: string = ''

  protected isSubmitDisabled: boolean = true

  protected selectedTimeInterval!: TimeInterval

  setDisabled(): void {
    this.isSubmitDisabled = this.confirmOrderForm.get('timeIntervalId')?.value === 'none'
    this.appRef.tick()
    console.log(this.confirmOrderForm.get('timeIntervalId')?.value, this.isSubmitDisabled)
  }

  protected confirmOrderForm: FormGroup = this.fb.group({
    timeIntervalId: this.fb.control("none"),
    messageToCustomer: this.fb.control(null)
  })

  protected rejectOrderForm: FormGroup = this.fb.group({
    messageToCustomer: this.fb.control(null)
  })

  protected performReject(): void {
    const messageField: string = this.confirmOrderForm.get('messageToCustomer')?.value

    const customMessage = !messageField ? '' : ' - Motivazione: ' + messageField

    const messageDTO: MessageDTO = {
      orderId: <string>this.orderId,
      message: `Purtroppo il tuo ordine non è stato accettato` + customMessage +' - Contattaci per avere maggiori informazioni',
      recipientUserId: this.order.user.id
    }

    this.orderSvc.rejectOrder(this.orderId as string).subscribe({
      next: res => {
        this.messageSvc.setMessageReadById(this.messageId).subscribe({ next: res => console.log(res) })
        this.socket.sendMessage(messageDTO).subscribe(ack => console.log(ack))
        this.confirm = true
        this.appRef.tick()
      }
    })

  }

  protected performConfirm(): void {

    const confirmOrderDTO: ConfirmOrderDTO = {
      orderId: <string>this.orderId,
      timeIntervalId: this.confirmOrderForm.get('timeIntervalId')?.value
    }

    const messageField: string = this.confirmOrderForm.get('messageToCustomer')?.value

    const customMessage = !messageField ? '' : '\nIl nostro staff ti ha lasciato un messaggio: ' + messageField

    this.selectedTimeInterval = this.getTimeIntervalInSessionById(confirmOrderDTO.timeIntervalId)

    const date = new Date()
    date.setTime(this.selectedTimeInterval.endsAt)

    const messageDTO: MessageDTO = {
      orderId: <string>this.orderId,
      message: `Il tuo ordine è stato accettato e sarà consegnato alle ORE ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` + customMessage,
      recipientUserId: this.order.user.id
    }


    this.orderSvc.confirmOrder(confirmOrderDTO).subscribe({
      next: res => {
        this.messageSvc.setMessageReadById(this.messageId).subscribe({ next: res => console.log(res) })
        this.socket.sendMessage(messageDTO).subscribe(ack => console.log(ack))
        this.confirm = true
        this.appRef.tick()
      }
    })

  }

  getTimeIntervalInSessionById(id: string): TimeInterval {
    return <TimeInterval>this.timeIntervals.find(ti => ti.id === id)
  }



}


