import { Component, Input } from '@angular/core';
import { Product } from '../../Models/i-product';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {

  @Input() public product: Product = {
    name: '',
    toppings: [],
    basePrice: 0,
    price: 0,
    category: ''
  }
}
