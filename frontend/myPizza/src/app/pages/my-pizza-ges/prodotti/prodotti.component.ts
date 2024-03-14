import { Component, ElementRef, HostListener, Inject, PLATFORM_ID, ViewChild, afterNextRender } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { CategoriesRes, Product, ProductNamesRes, ToppingRes } from '../../../Models/i-product';
import { Breakpoint } from '../../../Models/i-breakpoint';
import { isPlatformBrowser } from '@angular/common';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-prodotti',
  templateUrl: './prodotti.component.html',
  styleUrl: './prodotti.component.scss'
})
export class ProdottiComponent {
  constructor(private authSvc: AuthService, private productSvc: ProductService,
    @Inject(PLATFORM_ID) private platformId: string) {

    afterNextRender(() => {
      this.authSvc.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.authSvc.isAdmin$.subscribe(isAdmin => {
            if (isAdmin) {
              console.log('accesso admin concesso')
              this.productSvc.getProducts(2).subscribe(res => {
                this.lastPage = res.totalPages - 1
                res.content.forEach(el => {
                  this.products.push(el)
                  this.edit.push(false)
                })
                this.productSvc.getCategories().subscribe(res => this.categories = res)
                this.productSvc.getProductNames().subscribe(res => this.productNames = res)
                this.productSvc.getToppings().subscribe(res => {
                  console.log(res)
                  this.toppings = res
                  this.toppingDescriptions = this.toppings.toppings.map(t => t.description)
                  this.isLoading = false
                })

                for (let i: number = this.count + 1; i < res.totalPages; i++) {
                  this.onlyOnce.push(true)
                }


              })
            } else {
              console.log('accesso negato, miss permissions')
            }
          })
        } else (console.log('accesso negato: non loggato'))
      })
    })
  }

  @ViewChild('element') private element!: ElementRef

  public categories!: CategoriesRes

  public productNames!: ProductNamesRes

  public toppings!: ToppingRes

  public toppingDescriptions!: string[]

  protected isLoading = true

  protected edit: boolean[] = []

  protected products: Product[] = []

  private onlyOnce: boolean[] = []

  protected count: number = 0

  private lastPage: number = 0

  private height = 0

  protected get useClient(): boolean {
    return isPlatformBrowser(this.platformId)
  }

  protected deleteProduct(i: number) {
    this.isLoading = true
    const name: string = this.products.map(p => p.name)[i]
    this.productSvc.deleteProductByName(name).subscribe(res => {
      this.products.splice(i, 1)
      this.isLoading = false
    })
  }

  protected onScroll() {

    if (this.onlyOnce[this.count]) {

      this.isLoading = true
      this.onlyOnce[this.count] = false
      setTimeout(() => {
        this.productSvc.getProducts(2, this.count).subscribe(res => {
          res.content.forEach(el => {
            this.products.push(el)
            this.edit.push(false)
          })
          this.isLoading = false
        })
      }, 800)

      this.count++
      console.log(this.products)

      console.log('scroll')
    }


  }




}
