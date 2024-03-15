import { Component, Inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { Topping, ToppingRes } from '../../../Models/i-product';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-ingredienti',
  templateUrl: './ingredienti.component.html',
  styleUrl: './ingredienti.component.scss'
})
export class IngredientiComponent {
  constructor(private authSvc: AuthService, private productSvc: ProductService,
    @Inject(PLATFORM_ID) private platformId: string) {

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

  protected isAdmin: boolean = false

  private onlyOnce: boolean = true

  protected isLoading: boolean = true

  protected toppings: Topping[] = []

  protected get useClient() {
    return isPlatformBrowser(this.platformId)
  }

  ngOnInit() {

  }

  ngDoCheck() {
    if (this.isAdmin && this.onlyOnce) {
        this.onlyOnce = false
        this.productSvc.getToppings().subscribe(res => {
          this.toppings = res.toppings
          this.isLoading = false
          console.log(this.toppings)
        })
    }
}
}
