import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Menu } from '../../Models/i-menu';
import { Category, Product } from '../../Models/i-product';
import { OrderCheckModel, OrderInitDTO } from '../../Models/i-order';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'main#ordina-a-domicilio',
  templateUrl: './ordina-a-domicilio.component.html',
  styleUrl: './ordina-a-domicilio.component.scss'
})
export class OrdinaADomicilioComponent {

  constructor(private menuSvc: MenuService, private orderSvc: OrderService) { }

  protected isLoading = false

  protected menuItems: Menu[] = []

  protected orderCheckModels: OrderCheckModel[] = []

  private lastPage: number = 0

  private page: number = 0




  ngOnInit() {
    this.menuSvc.getMenu(6).subscribe(res => {
      res.content.forEach(m => {
        this.menuItems.push(m)
        if (m.item.type === 'PRODUCT') this.orderCheckModels.push({
          productId: this.castItemToProduct(m.item).id,
          isChecked: false,
          quantity: null
        })
      })
      this.lastPage = res.totalPages - 1
    })
  }

  private findProductById(id: string): Product {
    return this.menuItems.find(mi => mi.item.id === id)?.item as Product
  }

  protected isOrderSetEmpty() {
    return this.orderCheckModels.filter(ocm => ocm.isChecked).length === 0
  }

  protected setOrder() {
    const orderInit: OrderCheckModel[] = this.orderCheckModels.filter(ocm => ocm.isChecked)
    let isValid: boolean = true
    const isNotValidMessages: string[] = []
    orderInit.forEach(ocm => {
      if (ocm.quantity == null) {
        isValid = false
        isNotValidMessages.push(`Non è stata settata la quantità per il prodotto "${this.findProductById(ocm.productId).name}".`)
      }
      const regex = new RegExp(/^[1-9][0-9]*$/)
      console.log(String(ocm.quantity))
      console.log('regex valid', regex.test(String(ocm.quantity)))
      if (ocm.quantity != null && !regex.test(String(ocm.quantity))) {
        isValid = false
        isNotValidMessages.push(`Si è verificato un errore nella compilazione della quantità per il prodotto "${this.findProductById(ocm.productId).name}": sono ammessi soltanto numeri interi positivi e superiori a 0.`)
      }
    })
    if (!isValid) {
      // gestisci con un messaggio i problemi di validazione
      console.log(isNotValidMessages.join('\n'))
    } else {
      const orderInitDTO: OrderInitDTO = {
        orderSetsDTO: orderInit.map(ocm => {
          return {
            productId: ocm.productId,
            quantity: <number> ocm.quantity
          }
        })
      }
      console.log('order', orderInitDTO)
      this.orderSvc.orderInit(orderInitDTO).subscribe(res => {
        console.log(res)
      })
    }

  }

  protected findOrderModelByProductId(productId: string): OrderCheckModel {
    return this.orderCheckModels.find(ocm => ocm.productId === productId) as OrderCheckModel
  }

  protected castItemToProduct(item: Category | Product): Product {
    return item as Product
  }

  protected castItemToCategory(item: Category | Product): Category {
    return item as Category
  }



  protected onScroll() {
    this.isLoading = true


    if (this.page <= this.lastPage) {
      this.page++
      this.isLoading = true
      setTimeout(() => {
        this.menuSvc.getMenu(6, this.page).subscribe(res => {
          res.content.forEach(m => {
            this.menuItems.push(m)
            if (m.item.type === 'PRODUCT') this.orderCheckModels.push({
              productId: this.castItemToProduct(m.item).id,
              isChecked: false,
              quantity: null
            })
            console.log(this.orderCheckModels)
          })
          this.isLoading = false
        })
      }, 200)
    } else {
      this.isLoading = false
    }
  }
}
