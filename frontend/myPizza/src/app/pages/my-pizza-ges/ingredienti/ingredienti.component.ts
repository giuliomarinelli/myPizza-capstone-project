import { ApplicationRef, Component, Inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { OnToppingCreate, OnToppingUpdate, Topping, ToppingRes, _Toppings } from '../../../Models/i-product';
import { isPlatformBrowser } from '@angular/common';
import { OnViewRemove } from '../../../Models/i-product-dto';
import { Application } from 'express';

@Component({
  selector: 'app-ingredienti',
  templateUrl: './ingredienti.component.html',
  styleUrl: './ingredienti.component.scss'
})
export class IngredientiComponent {
  constructor(private authSvc: AuthService, private productSvc: ProductService,
    @Inject(PLATFORM_ID) private platformId: string, private appRef: ApplicationRef) {

    afterNextRender(() => {
      this.productSvc.getToppings().subscribe(res => {
        this.toppings = res.toppings
        this.toppingNames = res.toppings.map(t => t.name)
        console.log(this.toppingNames)
        this.isLoading = false
        this.onlyOnce = false
        this.toppings.forEach(t => this.edit.push(false))
        this.isLoading = false
        appRef.tick()
      })
    })
  }

  protected refresh(): void {
    this.appRef.tick()
  }

  protected isAdmin: boolean | undefined = undefined

  private onlyOnce: boolean = true

  protected isLoading: boolean = true

  protected disappear: boolean = false

  protected deleting: boolean = false

  protected toppings: _Toppings[] = []

  protected toppingNames: string[] = []

  protected edit: boolean[] = []

  protected viewRemoved: number[] = []

  protected get useClient(): boolean {
    return isPlatformBrowser(this.platformId)
  }

  protected allViewRemoved(): boolean {
    return this.toppings.filter((t, i) => {
      if (this.viewRemoved.includes(i)) return false
      return true
    }).length === 0
  }

  protected updateManage(e: OnToppingUpdate): void {
    this.appRef.tick()
    this.disappear = true
    setTimeout(() => {
      this.edit[e.i] = false
      this.toppings[e.i] = e.topping
      this.disappear = false
      this.appRef.tick()
    }, 500)
  }

  protected deleteManage(e: number): void {
    this.deleting = true
    this.appRef.tick()
    setTimeout(() => {
      const topping = this.toppings[e] as Topping
      const ind = this.toppingNames.findIndex(tn => tn === topping.name)
      this.toppingNames.splice(ind, 1)
      this.edit[e] = false
      this.toppings.splice(e, 1)
      this.deleting = false
      this.appRef.tick()
    }, 500)
  }

  protected outsideDeleteManage(i: number) {
    this.deleting = true
    this.isLoading = true
    const topping = this.toppings[i]
    let name: string = ''
    this.appRef.tick()
    if (topping != true && topping != false) name = topping.name
    this.productSvc.deleteToppingByName(name).subscribe(res => {
      setTimeout(() => {
        const topping = this.toppings[i] as Topping
        const ind = this.toppingNames.findIndex(tn => tn === topping.name)
        this.toppingNames.splice(ind, 1)
        this.toppings.splice(i, 1)
        this.isLoading = false
        this.deleting = false
        this.appRef.tick()
      }, 100)
    })


  }

  protected createStartManage(): void {
    this.toppings.push(true)
  }

  protected createManage(e: OnToppingCreate) {
    this.appRef.tick()
    this.disappear = true
    setTimeout(() => {
      this.toppings[e.i] = e.topping
      this.disappear = false
      const topping = this.toppings[e.i] as Topping
      this.toppingNames.push(topping.name)
      this.appRef.tick()
      this.isLoading = false

    }, 500)
  }


  protected viewRemoveManage(e: OnViewRemove): void {
    this.disappear = true
    this.appRef.tick()
    setTimeout(() => {
      switch (e.type) {
        case 'UPDATE':
          this.edit[e.i] = false
          this.appRef.tick()
          break
        case 'ADD':
          this.viewRemoved.push(e.i)
          this.appRef.tick()
      }
      this.disappear = false
    }, 500)
  }



  ngOnInit() {

  }


}
