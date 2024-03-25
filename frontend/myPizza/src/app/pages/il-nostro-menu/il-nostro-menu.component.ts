import { ApplicationRef, Component, NgZone, afterNextRender } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Menu } from '../../Models/i-menu';
import { OrderCheckModel } from '../../Models/i-order';
import { Category, Product } from '../../Models/i-product';

@Component({
  selector: 'app-il-nostro-menu',
  templateUrl: './il-nostro-menu.component.html',
  styleUrl: './il-nostro-menu.component.scss'
})
export class IlNostroMenuComponent {
  constructor(private menuSvc: MenuService, private orderSvc: OrderService, private authSvc: AuthService, private router: Router,
    private ngZone: NgZone, private appRef: ApplicationRef) {
    afterNextRender(() => {

    })
  }

  protected isLoading = true

  protected menuItems: Menu[] = []

  protected orderCheckModels: OrderCheckModel[] = []

  private lastPage: number = 0

  private page: number = 0

  protected IsLoggedIn!: boolean


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
      this.isLoading = false
      this.lastPage = res.totalPages - 1
    })
  }

  private findProductById(id: string): Product {
    return this.menuItems.find(mi => mi.item.id === id)?.item as Product
  }

  protected isOrderSetEmpty() {
    return this.orderCheckModels.filter(ocm => ocm.isChecked).length === 0
  }





  protected castItemToProduct(item: Category | Product): Product {
    return <Product>item
  }

  protected castItemToCategory(item: Category | Product): Category {
    return <Category>item
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
