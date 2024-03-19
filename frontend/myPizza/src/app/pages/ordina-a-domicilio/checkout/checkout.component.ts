import { Component, afterNextRender } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'main#checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  constructor(private orderSvc: OrderService, private authSvc: AuthService) {
    afterNextRender(() => {
      authSvc.isLoggedIn$.subscribe(res => {
        this.isGuest = !res
        console.log(this.isGuest)
        orderSvc.getOrderId().subscribe(res => {this.orderId = res.orderId})
        // se non c'è l'order id bisogna gestire la situazione
      })
    })
  }

  protected isGuest: boolean = true

  protected orderId: string = ''

}
