import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CategoriesRes, ProductNamesRes, Topping, ToppingRes } from '../../Models/i-product';
import { ProductErrorMessage } from '../../classes/product-error-message';

@Component({
  selector: 'app-product-save',
  templateUrl: './product-save.component.html',
  styleUrl: './product-save.component.scss'
})
export class ProductSaveComponent {

  constructor(private fb: FormBuilder) { }

  @Input() public type: string | undefined

  @Input() public productNames: ProductNamesRes | undefined

  @Input() public toppings: ToppingRes | undefined

  @Input() public categories: CategoriesRes | undefined

  @Output() public onFormInput = new EventEmitter<FormGroup>()

  protected errorMsg = new ProductErrorMessage()

  protected nameAlreadyExists: ValidatorFn = (formField: AbstractControl): ValidationErrors | null => {
    if (formField.value) {
      if (this.productNames?.productNames.includes(formField.value))
      return { nameAlreadyExists: true }
    }
    return null
  }

  protected OnFormInputEmit() {
    this.onFormInput.emit(this.productForm)
  }

  public productForm: FormGroup = this.fb.group({
    name: this.fb.control(null, [Validators.required, this.nameAlreadyExists]),
    basePrice: this.fb.control(null, [Validators.required, Validators.pattern(/^[0-9]+\.?[0-9]*$/)]),
    toppings: this.fb.array([]),
    category: this.fb.control('- Inserisci nuova -'),
    newCategory: this.fb.control(null)
  })

  protected getToppings(): FormArray {
    return this.productForm.controls['toppings'] as FormArray
  }

  protected addTopping(topping: Topping): void {
    (this.productForm.controls['topping'] as FormArray).push({
      name: this.fb.control(topping.name),
      price: this.fb.control(topping.price)
    })
  }

  protected removeTopping(i: number) {
    (this.productForm.controls['topping'] as FormArray).removeAt(i)
  }


  ngDoCheck() {


  }

  ngOnInit() {

  }


  private setInvalidMessages(fieldName: string): string {
    const field: AbstractControl | null = this.productForm.get(fieldName)
    console.log(fieldName, field)
    let errorMsg = ''
    if (field) {
      if (field.errors) {
        if (field.errors['required'] && fieldName === 'name' && field.dirty) errorMsg += 'Il nome è obbligatorio. '
        if (field.errors['required'] && fieldName === 'lastName' && field.dirty) errorMsg += 'Il cognome è obbligatorio. '
        if (field.errors['required'] && fieldName === 'email' && field.dirty) errorMsg += 'L\'email è obbligatorio. '
        if (field.errors['required'] && fieldName === 'phoneNumber' && field.dirty) errorMsg += 'Il telefono è obbligatorio. '
        if (field.errors['required'] && fieldName === 'cityAutocomplete' && field.dirty) errorMsg += 'La città è obbligatoria. '
        if (field.errors['unselectedCity'] && fieldName === 'cityAutocomplete' && field.dirty) errorMsg += 'La città è obbligatoria. '
        if (field.errors['required'] && fieldName === 'password' && field.dirty) errorMsg += 'La password è obbligatoria. '
        if (field.errors['required'] && fieldName === 'confirmPassword' && field.dirty) errorMsg += 'Il campo conferma password è obbligatorio. '
        if (field.errors['required'] && fieldName === 'road' && field.dirty) errorMsg += 'La via è obbligatoria. '
        if (field.errors['minlength'] && fieldName === 'firstName' && field.dirty) errorMsg += 'Il nome deve avere almeno 2 caratteri. '
        if (field.errors['minlength'] && fieldName === 'lastName' && field.dirty) errorMsg += 'Il cognome deve avere almeno 2 caratteri. '

        if (field.errors['pattern'] && fieldName === 'firstName') errorMsg += 'Sono ammessi solo caratteri alfabetici. '
        if (field.errors['pattern'] && fieldName === 'lastName') errorMsg += 'Sono ammessi solo caratteri alfabetici. '
        if (field.errors['pattern'] && fieldName === 'email') errorMsg += 'Formato email errato. '
        if (field.errors['pattern'] && fieldName === 'phoneNumber') errorMsg += 'Sono ammessi solo caratteri numerici. '
      }

    }
    return errorMsg
  }

  protected isValid(fieldName: string) {
    return this.productForm.get(fieldName)?.valid && this.productForm.get(fieldName)?.dirty
  }

  protected isInvalid(fieldName: string) {
    return !this.productForm.get(fieldName)?.valid && this.productForm.get(fieldName)?.dirty
  }


  private markAsDirtyAndUpdateValueAndValidity(control: AbstractControl): void {
    control.markAsDirty();
    control.updateValueAndValidity({ onlySelf: true });
  }

  private markAll(): void {
    Object.values(this.productForm.controls).forEach(control => {
      if (control.invalid) {
        this.markAsDirtyAndUpdateValueAndValidity(control)
      }
      const road: AbstractControl | null = this.productForm.get('address.road')
      const civic: AbstractControl | null = this.productForm.get('address.civic')
      const cityAutocomplete: AbstractControl | null = this.productForm.get('address.cityAutocomplete')
      if (this.productForm.get('gender')?.value === '0') this.productForm.get('gender')?.markAsDirty()
      if (road?.invalid) {
        this.markAsDirtyAndUpdateValueAndValidity(road)
      }
      if (civic?.invalid) {
        this.markAsDirtyAndUpdateValueAndValidity(civic)
      }
      if (cityAutocomplete?.invalid) {
        this.markAsDirtyAndUpdateValueAndValidity(cityAutocomplete)
      }
    });
  }


}
