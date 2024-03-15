import { Component, ElementRef, HostListener, Inject, PLATFORM_ID, ViewChild, afterNextRender } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { CategoriesRes, OnProductUpdate, Product, ProductNamesRes, ToppingRes } from '../../../Models/i-product';
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



    protected isAdmin = false

    private _onlyOnce = true

    protected onlyOne = false

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

    protected getToppinsDescriptions(i: number): string[] {
        return this.products[i].toppings.map(t => t.description)
    }

    ngDoCheck() {
        if (this.isAdmin && this._onlyOnce) {
            this._onlyOnce = false
            this.productSvc.getCategories().subscribe(res => this.categories = res)
            this.productSvc.getProductNames().subscribe(res => this.productNames = res)
            this.productSvc.getToppings().subscribe(res => {
                this.toppings = res
                this.toppingDescriptions = this.toppings.toppings.map(t => t.description)
            })
            this.productSvc.getProducts(2).subscribe(res => {
                if (res.totalElements === 1) this.onlyOne = true
                res.content.forEach(p => {
                    this.products.push(p)
                    this.edit.push(false)
                    this.onlyOnce.push(true)
                })
                this.isLoading = false
            })
        }
    }

    protected get useClient(): boolean {
        return isPlatformBrowser(this.platformId)
    }

    protected deleteProduct(i: number): void {
        this.isLoading = true
        const name: string = this.products.map(p => p.name)[i]
        this.productSvc.deleteProductByName(name).subscribe(res => {
            this.products.splice(i, 1)
            this.isLoading = false
        })
    }

    protected updateProduct(e: OnProductUpdate): void {
        this.isLoading = true
        const product = this.products[e.i]
        this.productSvc.updateProductByName(product.name, e.product).subscribe(res => {
            this.products.splice(e.i, 1, res)
            console.log(res)
            console.log(this.products[e.i])
            this.edit[e.i] = false
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
