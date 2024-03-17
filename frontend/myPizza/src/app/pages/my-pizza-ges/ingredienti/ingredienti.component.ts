import { Component, Inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { OnToppingCreate, OnToppingUpdate, Topping, ToppingRes, _Toppings } from '../../../Models/i-product';
import { isPlatformBrowser } from '@angular/common';
import { OnViewRemove } from '../../../Models/i-product-dto';

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

  protected toppings: _Toppings[] = []

  protected toppingNames: string[] = []

  protected edit: boolean[] = []

  protected viewRemoved: number[] = []

  protected get useClient(): boolean {
    return isPlatformBrowser(this.platformId)
  }

  protected updateManage(e: OnToppingUpdate): void {
    this.edit[e.i] = false
    this.toppings[e.i] = e.topping
  }

  protected deleteManage(e: number): void {
    this.edit[e] = false
    this.toppings.splice(e, 1)
  }

  protected outsideDeleteManage(i: number) {
    this.isLoading = true
    const topping = this.toppings[i]
    let name: string = ''
    if (topping != true && topping != false) name = topping.name
    this.productSvc.deleteToppingByName(name).subscribe(res => {
      this.toppings.splice(i, 1)
      this.isLoading = false
    })
  }

  protected createStartManage(): void {
    this.toppings.push(true)
  }

  protected createManage(e: OnToppingCreate) {
    this.toppings[e.i] = e.topping
  }

  protected viewRemoveManage(e: OnViewRemove): void {
    switch(e.type) {
      case 'UPDATE':
        this.edit[e.i] = false
        break
      case 'ADD':
        this.viewRemoved.push(e.i)
    }
  }



  ngOnInit() {

  }

  ngDoCheck() {
    if (this.isAdmin === true && this.onlyOnce) {
      this.productSvc.getToppings().subscribe(res => {
        this.toppings = res.toppings
        this.toppingNames = res.toppings.map(t => t.name)
        this.isLoading = false
        this.onlyOnce = false
        this.toppings.forEach(t => this.edit.push(false))
      })
    }
  }
}