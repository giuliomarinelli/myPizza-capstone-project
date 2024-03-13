import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CategoriesRes, ProductNamesRes, ProductValidation, Topping, ToppingRes } from '../../Models/i-product';
import { ProductErrorMessage } from '../../classes/product-error-message';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipInputEvent } from '@angular/material/chips';
import { AddProduct } from '../../Models/i-add-product';

@Component({
  selector: 'app-product-save',
  templateUrl: './product-save.component.html',
  styleUrl: './product-save.component.scss'
})
export class ProductSaveComponent {

  constructor(private fb: FormBuilder) {

  }

  @Input() public mark: boolean = false

  @Input() public type: string | undefined

  @Input() public productNames: ProductNamesRes | undefined

  @Input() public toppings: ToppingRes | undefined

  @Input() public toppingDescriptions!: string[]

  @Input() public categories: CategoriesRes | undefined

  @Input() public i!: number

  @Output() public onFormInput = new EventEmitter<AddProduct>()

  @Output() public onDelete = new EventEmitter<number>()

  @Output() public onValidation = new EventEmitter<ProductValidation>()

  protected errorMsg = new ProductErrorMessage()

  private calcFullPrice() {
    const toppings: Topping[] = []
    this.addedToppingDescriptions.forEach(el => {
      const topping = this.toppings?.toppings.find(t => t.description === el)
      if (topping) toppings.push(topping)
    })
    const toppingsAmount = toppings.length ? toppings.map(t => t.price).reduce((c, p) => c + p) : 0
      this.fullPriceCtrl.setValue((Number(this.productForm.get('basePrice')?.value) + toppingsAmount).toFixed(2))
  }

  protected nameAlreadyExists: ValidatorFn = (formField: AbstractControl): ValidationErrors | null => {
    if (formField.value) {
      if (this.productNames?.productNames.includes(formField.value))
        return { nameAlreadyExists: true }
    }
    return null
  }

  protected unselectedCategory: ValidatorFn = (formField: AbstractControl): ValidationErrors | null => {
    if (formField.value) {
      if (formField.value === '(seleziona una categoria)')
        return { unselectedCategory: true }
    }
    return null
  }

  protected onFormInputEmit() {
    const toppings: Topping[] = []
    this.addedToppingDescriptions.forEach(el => {
      const topping = this.toppings?.toppings.find(t => t.description === el)
      if (topping) toppings.push(topping)
    })
    this.onFormInput.emit({
      name: this.productForm.get('name')?.value,
      basePrice: Number(this.productForm.get('basePrice')?.value),
      category: this.productForm.get('category')?.value,
      newCategory: this.productForm.get('newCategory')?.value,
      toppings,
      i: this.i,
      isValid: this.productForm.valid
    })
  }

  protected onDeleteEmit() {
    this.onDelete.emit(this.i)
  }

  protected productForm: FormGroup = this.fb.group({
    name: this.fb.control(null, [Validators.required, this.nameAlreadyExists]),
    basePrice: this.fb.control(null, [Validators.required, Validators.pattern(/^[0-9]+\.?[0-9]*$/)]),
    category: this.fb.control('(seleziona una categoria)', [this.unselectedCategory]),
    newCategory: this.fb.control({ value: null, disabled: true })
  })

  protected fullPriceCtrl = new FormControl({ value: '0.00', disabled: true })




  ngDoCheck() {
    if (this.productForm.get('category')?.value === '- Inserisci nuova -') {
      this.productForm.get('newCategory')?.enable()
    } else {
      this.productForm.get('newCategory')?.reset()
      this.productForm.get('newCategory')?.setValue(null)
      this.productForm.get('newCategory')?.disable()
      this.onFormInputEmit()
    }
    if (this.mark) this.markAll()

  }

  ngOnInit() {
    this.onFormInputEmit()
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

  protected onInputBasePrice() {
    this.calcFullPrice()
    this.onFormInputEmit()
  }



  protected separatorKeysCodes: number[] = [] //[13, 188];
  protected toppingDescriptionsControl = new FormControl('');
  protected addedToppingDescriptions: string[] = []


  @ViewChild('toppingInput') toppingInput: ElementRef<HTMLInputElement> | undefined;

  announcer = inject(LiveAnnouncer);



  protected add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      this.addedToppingDescriptions.push(value);
    }
    this.onFormInputEmit()
    this.calcFullPrice()
    // Clear the input value
    event.chipInput!.clear();

    this.toppingDescriptionsControl.setValue(null);
  }

  protected remove(toppingDesc: string): void {
    const index = this.addedToppingDescriptions.indexOf(toppingDesc);
    console.log(this.addedToppingDescriptions)
    this.addedToppingDescriptions.splice(index, 1);
    this.onFormInputEmit()
    this.announcer.announce(`Removed ${toppingDesc}`);
    this.calcFullPrice()
  }

  protected selected(event: MatAutocompleteSelectedEvent): void {
    const toppingDesc: string = event.option.viewValue
    if (this.addedToppingDescriptions.includes(toppingDesc)) {
      const ind = this.addedToppingDescriptions.indexOf(toppingDesc)
      this.addedToppingDescriptions.splice(ind, 1)
    } else {
      this.addedToppingDescriptions.push(event.option.viewValue);
    }

    this.onFormInputEmit()
    this.calcFullPrice()

    if (this.toppingInput) this.toppingInput.nativeElement.value = '';
    this.toppingDescriptionsControl.setValue(null);
  }




}