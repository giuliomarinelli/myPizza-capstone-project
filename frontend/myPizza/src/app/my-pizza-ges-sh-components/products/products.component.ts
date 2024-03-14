import { Component, Input } from '@angular/core';
import { Product } from '../../Models/i-product';
import { Breakpoint } from '../../Models/i-breakpoint';
import { ProductService } from '../../services/product.service';
import { ViewportRuler } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  constructor(private productSvc: ProductService, private viewportRuler: ViewportRuler) { }

  @Input() protected products: Product[] = []
  @Input() protected onlyOnce: boolean[] = []
  @Input() protected count: number = 0
  @Input() protected breakpoints: Breakpoint[] = []

  ngDoCheck() {



    console.log('ciao')
    console.log(this.getScrollY())
    if (this.onlyOnce[this.count]) {
      if (this.onlyOnce[this.count] && this.getScrollY() > this.breakpoints[this.count].threshold) {
        this.onlyOnce[this.count] = false
        this.productSvc.getProducts(5, this.count).subscribe(res => res.content.forEach(el => this.products.push(el)))
        this.count++
        console.log(this.products)
      }
    }
  }

  private getScrollY(): number {
    const { top } = this.viewportRuler.getViewportScrollPosition()
    return top
  }

}
