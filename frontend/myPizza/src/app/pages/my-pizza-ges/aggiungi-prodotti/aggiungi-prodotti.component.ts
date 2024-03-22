import { Component, Inject, PLATFORM_ID, afterNextRender, afterRender } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { isPlatformBrowser } from '@angular/common';
import { CategoriesRes, ProductNamesRes, ProductValidation, ToppingRes } from '../../../Models/i-product';
import { AddProduct } from '../../../Models/i-add-product';
import { ManyProductsPostDTO, ProductDTO } from '../../../Models/i-product-dto';
import { MatDialog } from '@angular/material/dialog';
import { AggiungiProdottiDialogComponent } from '../aggiungi-prodotti-dialog/aggiungi-prodotti-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aggiungi-prodotti',
  templateUrl: './aggiungi-prodotti.component.html',
  styleUrl: './aggiungi-prodotti.component.scss'
})
export class AggiungiProdottiComponent {
  constructor(private authSvc: AuthService, private productSvc: ProductService,
    @Inject(PLATFORM_ID) private platformId: string, public dialog: MatDialog, private router: Router) {
    afterNextRender(() => {
      this.authSvc.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.authSvc.isAdmin$.subscribe(isAdmin => {
            if (isAdmin) {
              console.log('accesso admin concesso')
              this.isAdmin = true
              this.res = true
            } else {
              this.isAdmin = false
              this.res = true
            }
          })
        } else {
          this.res = true
          this.isLoading = false
        }
      })

    })
  }


  protected openDialog() {
    const dialogRef = this.dialog.open(AggiungiProdottiDialogComponent)

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  protected res: boolean = false

  protected onlyOnceAnimated = true

  private onlyOnce: boolean = true

  protected isAdmin: boolean | undefined = undefined

  public isLoading = true

  public categories!: string[]

  public productNames!: ProductNamesRes

  public toppings!: ToppingRes

  public toppingDescriptions!: string[]


  ngDoCheck() {
    if (this.isAdmin && this.onlyOnce) {
      this.onlyOnce = false
      this.productSvc.getCategories().subscribe(res => this.categories = res.categories)
      this.productSvc.getProductNames().subscribe(res => this.productNames = res)
      this.productSvc.getToppings('TOPPING').subscribe(res => {
        this.toppings = res
        this.toppingDescriptions = this.toppings.toppings.map(t => t.description)
        this.isLoading = false
        setTimeout(() => this.onlyOnceAnimated = false, 500)
      })

    }
  }

  protected onDelete: number = -1

  protected onAdd: boolean = false

  protected validation: ProductValidation[] = []

  protected mark = false

  protected addProductForms: boolean[] = [true]

  protected addProductData: AddProduct[] = []

  protected get useClient(): boolean {
    return isPlatformBrowser(this.platformId)
  }

  public act(event: AddProduct): void {
    const i = event.i
    if (i != undefined) {
      this.addProductData[i] = event
    }

  }

  protected isproductDeleted(i: number) {
    if (this.addProductData[i] != undefined) return this.addProductData[i].deleted
    return false
  }

  protected addForm(): void {
    this.onAdd = true
    setTimeout(() => {
      this.addProductForms.push(true)
      this.onAdd = false
    }, 50)
  }

  protected delete(e: number): void {
    this.onDelete = e
    setTimeout(() => {
      this.addProductForms[e] = false
      this.addProductData[e].deleted = true
      this.onDelete = -1
    }, 500)


  }

  protected saveValidation(e: ProductValidation) {
    const i = e.i
    this.validation[i] = e
  }

  protected performSubmit() {
    this.isLoading = true
    let isAllValid: boolean = true
    const addProductDataActive = this.addProductData.filter(p => p.deleted === false)
    for (let i = 0; i < addProductDataActive.length; i++) {
      if (addProductDataActive[i].isValid === false) {
        isAllValid = false
        break
      }
    }
    console.log(addProductDataActive)
    if (!isAllValid) {
      this.mark = true
      this.isLoading = false
      return
    }


    const products: ProductDTO[] = this.addProductData.filter(p => p.deleted === false).map((p: AddProduct, ind: number) => {
      const { newCategory, toppings, isValid, i, ...otherProps } = p
      let name = ''
      let basePrice = 0
      let category = ''
      if (otherProps.basePrice !== null) basePrice = otherProps.basePrice
      if (otherProps.category !== null) category = newCategory ? newCategory : otherProps.category
      if (otherProps.name !== null) name = otherProps.name
      return {
        name,
        basePrice,
        category,
        toppings: toppings.map(t => t.name)
      }
    })

    const productsDTO: ManyProductsPostDTO = { products }

    this.productSvc.addManyProducts(productsDTO).subscribe(res => {
      this.isLoading = false
      this.openDialog()
    })

  }


}
