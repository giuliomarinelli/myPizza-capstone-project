import { OrderSet } from './../../../Models/i-order';
import { Component, afterNextRender } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { Address } from '../../../Models/i-user';
import { SocketService } from '../../../services/socket.service';
import { PublicApiService } from '../../../services/public-api.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'main#checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  constructor(private orderSvc: OrderService, private authSvc: AuthService,
    private socket: SocketService, private publicApi: PublicApiService, private _session: SessionService) {

    afterNextRender(() => {
      _session.isThereAnActiveSession().subscribe(res => {
        this.isThereAnActiveSession = res
        this.res = true
        this.isLoading = false
      })
      publicApi.getAdminUserId().subscribe(res => this.adminUserId = res)
      authSvc.isLoggedIn$.subscribe(res => {
        this.isGuest = !res
        orderSvc.getOrderInit().subscribe(res => {
          this.orderId = res.orderId
          this.deliveryCost = res.deliveryCost
          this.address = res.address
          this.orderSets = res.orderSets
          this.totalAmount = res.totalAmount
          this.isLoading = false
          console.log(res)
          if (!this.isGuest) authSvc.getAddresses().subscribe(addRes => {
            this.addresses = addRes.addresses
            console.log(addRes)
          })

        })
        // se non c'è l'order id bisogna gestire la situazione
      })
    })
  }

  protected res = false

  protected isThereAnActiveSession!: boolean

  private adminUserId!: string

  protected isLoading: boolean = true

  protected addresses: Address[] = []

  protected totalAmount: number = 0

  protected orderSets: OrderSet[] = []

  protected address!: Address

  protected isGuest: boolean = true

  protected orderId: string = ''

  protected deliveryCost: number = 0

  protected sendOrder(): void {
    console.log(this.orderId)
    this.socket.sendMessage({
      recipientUserId: this.adminUserId,
      message: 'Nuova richiesta di ordine inviata',
      orderId: this.orderId
    }).subscribe(ack => console.log(ack))
  }

}
