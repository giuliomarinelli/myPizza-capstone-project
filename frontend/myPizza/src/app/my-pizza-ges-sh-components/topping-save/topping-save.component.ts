import { Component, Input } from '@angular/core';
import { Topping } from '../../Models/i-product';

@Component({
  selector: 'app-topping-save',
  templateUrl: './topping-save.component.html',
  styleUrl: './topping-save.component.scss'
})
export class ToppingSaveComponent {

  @Input() public topping!: Topping

  @Input() public toppingNames: string[] = []

}
