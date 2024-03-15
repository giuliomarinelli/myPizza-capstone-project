import { Component, Input } from '@angular/core';
import { Topping } from '../../Models/i-product';

@Component({
  selector: 'app-topping-card',
  templateUrl: './topping-card.component.html',
  styleUrl: './topping-card.component.scss'
})
export class ToppingCardComponent {

  @Input() public topping: Topping | undefined




}
