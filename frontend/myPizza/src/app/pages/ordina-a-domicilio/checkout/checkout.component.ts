import { DeliveryTimeRes } from './../../../Models/i_session';
import { OrderSet, SendOrderDTO } from './../../../Models/i-order';
import { Component, NgZone, afterNextRender } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { Address } from '../../../Models/i-user';
import { SocketService } from '../../../services/socket.service';
import { PublicApiService } from '../../../services/public-api.service';
import { SessionService } from '../../../services/session.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'main#checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  constructor(private orderSvc: OrderService, private authSvc: AuthService, private fb: FormBuilder, private ngZone: NgZone,
    private socket: SocketService, private publicApi: PublicApiService, private _session: SessionService, private router: Router) {

    afterNextRender(() => {
      _session.isThereAnActiveSession().subscribe(res => {
        this.isThereAnActiveSession = res
        this.res = true
        this.isLoading = false
        this._session.getDeliveryTimes().subscribe(res => this.deliveryTimes = res.deliveryTimes)
      })
      publicApi.getAdminUserId().subscribe(res => this.adminUserId = res)
      authSvc.isLoggedIn$.subscribe(res => {
        this.isGuest = !res
        orderSvc.getOrderInit().subscribe({next: res => {
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

        },
        error: err => ngZone.run(() => router.navigate(['/ordina-a-domicilio']))
      })
        // se non c'è l'order id bisogna gestire la situazione
      })
    })
  }

  ngDoCheck() {
    this.selectDisabled = this.checkoutForm.get('deliveryTime')?.value === 0 || String(this.checkoutForm.get('deliveryTime')?.value) === '0'
  }

  protected deliveryTimes: number[] = []
  protected checkoutForm = this.fb.group({
    deliveryTime: this.fb.control(0),
    asap: this.fb.control(false)
  })

  protected selectDisabled: boolean = true

  protected selectedTime!: number


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

  protected sent: boolean = false

  protected sendOrder(): void {
    console.log(this.orderId)
    this.socket.sendMessage({
      recipientUserId: this.adminUserId,
      message: 'Nuova richiesta di ordine inviata',
      orderId: this.orderId
    }).subscribe(ack => console.log(ack))
    const sendOrderDTO: SendOrderDTO = {
      asap: <boolean>this.checkoutForm.get('asap')?.value,
      expectedDeliveryTime: <number>this.checkoutForm.get('deliveryTime')?.value,
      orderId: this.orderId,
      address: this.address
    }
    console.log(sendOrderDTO)
    console.log(this.checkoutForm.get('deliveryTime')?.value)
    this.orderSvc.sendOrder(sendOrderDTO).subscribe({
      next: res => {
        console.log(res)
        this.sent = true
      },
      error: err => console.log(err)
    })
  }

}
