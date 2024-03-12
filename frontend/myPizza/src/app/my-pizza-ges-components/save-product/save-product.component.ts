import { Component, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-save-product',
  templateUrl: './save-product.component.html',
  styleUrl: './save-product.component.scss'
})
export class SaveProductComponent {

  constructor(private fb: FormBuilder) { }

  @Input() public type: string | undefined

  @Input() public productNames: string[] | undefined

  @Output() onFormInput = new EventEmitter<any>()

  protected OnFormInputEmit() {
    this.onFormInput.emit(this.productForm.value)
  }

  public productForm: FormGroup = this.fb.group({
    name: this.fb.control(null, [Validators.required]),
    basePrice: this.fb.control(null, [Validators.required, Validators.pattern(/^[0-9]+\.?[0-9]*$"/)]),
    toppings: this.fb.array([])
  })





}
