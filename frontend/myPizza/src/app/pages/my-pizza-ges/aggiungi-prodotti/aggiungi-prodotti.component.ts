import { Component, Inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { isPlatformBrowser } from '@angular/common';
import { CategoriesRes, ProductNamesRes, ToppingRes } from '../../../Models/i-product';

@Component({
  selector: 'app-aggiungi-prodotti',
  templateUrl: './aggiungi-prodotti.component.html',
  styleUrl: './aggiungi-prodotti.component.scss'
})
export class AggiungiProdottiComponent {
  constructor(private authSvc: AuthService, private productSvc: ProductService, @Inject(PLATFORM_ID) private platformId: string) {
    afterNextRender(() => {
      this.authSvc.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.authSvc.isAdmin$.subscribe(isAdmin => {
            if (isAdmin) {
              console.log('accesso admin concesso')
              this.productSvc.getCategories().subscribe(res => this.categories = res)
              this.productSvc.getProductNames().subscribe(res => this.productNames = res)
              this.productSvc.getToppings().subscribe(res => this.toppings = res)
            } else {
              console.log('accesso negato, miss permissions')
            }
          })
        } else (console.log('accesso negato: non loggato'))
      })
    })
  }

  public categories!: CategoriesRes

  public productNames!: ProductNamesRes

  public toppings!: ToppingRes

  protected get useClient(): boolean {
    return isPlatformBrowser(this.platformId)
  }




}
