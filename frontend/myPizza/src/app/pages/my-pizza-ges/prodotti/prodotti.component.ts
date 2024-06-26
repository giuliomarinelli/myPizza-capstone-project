import { Socket } from 'socket.io-client';
import { ApplicationRef, Component, ElementRef, HostListener, Inject, PLATFORM_ID, ViewChild, afterNextRender } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { CategoriesRes, Category, OnProductUpdate, Product, ProductNamesRes, ToppingRes } from '../../../Models/i-product';
import { Breakpoint } from '../../../Models/i-breakpoint';
import { isPlatformBrowser } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { count } from 'console';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-prodotti',
  templateUrl: './prodotti.component.html',
  styleUrl: './prodotti.component.scss'
})
export class ProdottiComponent {
  constructor(private authSvc: AuthService, private productSvc: ProductService,
    @Inject(PLATFORM_ID) private platformId: string, private socket: SocketService, private appRef: ApplicationRef) {

    afterNextRender(() => {
      this.productSvc.getCategories().subscribe(res => {
        this.categories = res.categories
        this.productSvc.getProductNames().subscribe(res => {
          this.productNames = res
          this.productSvc.getToppings('TOPPING').subscribe(res => {
            this.toppings = res
            this.toppingDescriptions = this.toppings.toppings.map(t => t.description)
            this.isLoading = false
            appRef.tick()
          })
        })
      })


      this.productSvc.getProducts(6).subscribe(res => {
        this.lastPage = res.totalPages - 1
        res.content.forEach(p => {
          this.products.push(p)
          this.edit.push(false)
          this.onlyOnce.push(true)
        })
        this.isLoading = false
      })
    })
  }

  private page: number = 0

  protected onDisappear: boolean = false

  protected onDelete: boolean = false

  protected isAdmin = false

  private _onlyOnce = true

  protected onlyOne = false

  public categories!: string[]

  public productNames!: ProductNamesRes

  public toppings!: ToppingRes

  public toppingDescriptions!: string[]

  protected isLoading = true

  protected edit: boolean[] = []

  protected products: Product[] = []

  private onlyOnce: boolean[] = []

  private lastPage: number = 0

  protected getToppinsDescriptions(i: number): string[] {
    return this.products[i].toppings.map(t => t.description)
  }


  protected setUpdate(i: number): void {
    this.edit[i] = true
    this.appRef.tick()
  }


  protected get useClient(): boolean {
    return isPlatformBrowser(this.platformId)
  }

  protected deleteProduct(i: number): void {
    this.onDelete = true
    this.isLoading = true
    const name: string = this.products.map(p => p.name)[i]
    this.appRef.tick()
    this.productSvc.deleteProductByName(name).subscribe(res => {
      setTimeout(() => {
        this.onDelete = false
        this.products.splice(i, 1)
        this.isLoading = false
        this.appRef.tick()
      }, 500)
    })
    this.productSvc.getCategories().subscribe(res => this.categories = res.categories)

  }

  protected updateProduct(e: OnProductUpdate): void {
    this.onDisappear = true
    this.isLoading = true
    const product = this.products[e.i]
    this.appRef.tick()
    console.log(e)
    this.productSvc.updateProductByName(product.name, e.product).subscribe(res => {
      setTimeout(() => {
        console.log(res)
        this.products.splice(e.i, 1, res)
        console.log(this.products[e.i])
        this.edit[e.i] = false
        this.isLoading = false
        this.productSvc.getCategories().subscribe(res => this.categories = res.categories)
        this.onDisappear = false
        this.appRef.tick()
      }, 500)

    })
  }

  protected onScroll() {
    this.isLoading = true
    console.log('scroll')
    if (this.page <= this.lastPage) {
      this.page++
      setTimeout(() => {
        this.productSvc.getProducts(6, this.page).subscribe(res => {
          res.content.forEach(el => {
            this.products.push(el)
            this.edit.push(false)
          })
          this.isLoading = false
        })
      }, 200)
    } else {
      this.isLoading = false
    }


    console.log(this.products)

    console.log('scroll')
  }


}





