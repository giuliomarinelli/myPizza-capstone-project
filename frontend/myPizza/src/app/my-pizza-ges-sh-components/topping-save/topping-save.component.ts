import { Component, Input } from '@angular/core';
import { Topping } from '../../Models/i-product';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-topping-save',
  templateUrl: './topping-save.component.html',
  styleUrl: './topping-save.component.scss'
})
export class ToppingSaveComponent {

  constructor(private fb: FormBuilder) {}

  @Input() public topping!: Topping

  @Input() public toppingNames: string[] = []

  protected toppingForm = this.fb.group({
    name: this.fb.control(null, [Validators.required]),
    price: this.fb.control(null, [Validators.required])
  })

}
