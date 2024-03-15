import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OnToppingUpdate, Topping, ToppingDTO } from '../../Models/i-product';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-topping-save',
  templateUrl: './topping-save.component.html',
  styleUrl: './topping-save.component.scss'
})
export class ToppingSaveComponent {

  constructor(private fb: FormBuilder, private productSvc: ProductService) { }

  @Input() public topping!: Topping

  @Input() public toppingNames: string[] = []

  @Input() public type: string = 'ADD'

  @Input() public i: number = 0

  @Output() protected onCreate = new EventEmitter<Topping>()

  @Output() protected onUpdate = new EventEmitter<OnToppingUpdate>()

  @Output() protected onDelete = new EventEmitter<number>()

  @Output() protected onViewRemove = new EventEmitter<number>()

  @Output() protected onLoading = new EventEmitter<boolean>()



  protected nameAlreadyExists: ValidatorFn = (formField: AbstractControl): ValidationErrors | null => {
    if (formField.value) {
      if (this.toppingNames.includes(formField.value))
        return { nameAlreadyExists: true }
    }
    return null
  }

  protected toppingForm: FormGroup = this.fb.group({
    name: this.fb.control(null, [Validators.required, this.nameAlreadyExists]),
    price: this.fb.control(null, [Validators.required, Validators.pattern(/^[0-9]+\.?[0-9]*$/)]),
  })





  ngDoCheck() {

  }

  ngOnInit() {
    if (this.type === 'UPDATE' && this.topping != undefined) {
      this.toppingForm.controls['name']?.setValue(this.topping.name)
      this.toppingForm.controls['price']?.setValue(this.topping.price)
      this.markAll()
    }
  }

  protected delete() {
    this.onLoading.emit(true)
    this.productSvc.deleteToppingByName(this.topping.name).subscribe(res => {
      this.onDelete.emit(this.i)
      this.onLoading.emit(false)
    })
  }

  protected performSubmit(): void {
    if (this.toppingForm.valid) {
      this.onLoading.emit(true)
      const name: string = this.toppingForm.get('name')?.value
      const price: number = Number(this.toppingForm.get('price')?.value)
      const toppingDTO: ToppingDTO = {
        name,
        price
      }
      switch (this.type) {
        case 'ADD':
          this.productSvc.addTopping(toppingDTO).subscribe(res => {
            this.onCreate.emit(res)
            this.onLoading.emit(false)
          })
          break
        case 'UPDATE':
          this.productSvc.updateToppingByName(this.topping.name, toppingDTO).subscribe(res => {
            this.onUpdate.emit({
              topping: res,
              i: this.i
            })
            this.onLoading.emit(false)
          })
      }
    } else {
      console.log('validazione fallita... messaggio....')
      this.markAll()
    }
  }


  private setInvalidMessages(fieldName: string): string {
    const field: AbstractControl | null = this.toppingForm.get(fieldName)

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
    return this.toppingForm.get(fieldName)?.valid && this.toppingForm.get(fieldName)?.dirty
  }

  protected isInvalid(fieldName: string) {
    return !this.toppingForm.get(fieldName)?.valid && this.toppingForm.get(fieldName)?.dirty
  }


  private markAsDirtyAndUpdateValueAndValidity(control: AbstractControl): void {
    control.markAsDirty();
    control.updateValueAndValidity({ onlySelf: true });
  }

  private markAll(): void {
    Object.values(this.toppingForm.controls).forEach(control => {
      this.markAsDirtyAndUpdateValueAndValidity(control)
    })
  }

}
