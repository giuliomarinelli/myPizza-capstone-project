import { Component, Input } from '@angular/core';
import { Product } from '../../Models/i-product';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {

  @Input() public name: string = ''

  @Input() public category: string = ''

  @Input() public price: number = 0

  @Input() public toppingDescriptions: string[] = []

  protected _price: number = 0

  protected _toppingDescriptions: string[] = []

  ngDoCheck() {
    this._price = this.price
    this._toppingDescriptions = this.toppingDescriptions
    console.log(this.name, this.category, this.price, this.toppingDescriptions)
  }

}
