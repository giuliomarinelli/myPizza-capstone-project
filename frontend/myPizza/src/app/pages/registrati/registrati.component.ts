import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AddressRegisterDTO, UserRegister } from '../../Models/user-dto';
import { RegisterErrorMsg } from '../../Models/i-register-error-msg';
import { PublicApiService } from '../../services/public-api.service';

@Component({
  selector: 'app-registrati',
  templateUrl: './registrati.component.html',
  styleUrl: './registrati.component.scss'
})
export class RegistratiComponent {

  constructor(private fb: FormBuilder, private authSvc: AuthService, private publicApiSvc: PublicApiService) { }

  protected internationalPrefixList!: string[]
  protected loginErrorMsg: string = ''

  protected valid!: boolean

  protected validLogin: boolean = true

  ngDoCheck() {
    // this.errorMsg = `${this.setInvalidMessages('email')}${this.setInvalidMessages('password')}`
    this.valid = this.registerForm['valid']
  }

  ngOnInit() {
    this.publicApiSvc.getAllInternationalPrefixes().subscribe(res => {
      const ind = res.findIndex(p => p === '+39')
      res.splice(ind, 1)
      this.internationalPrefixList = res
      console.log(res)
      console.log(this.internationalPrefixList)
    })
  }

  protected registerForm: FormGroup = this.fb.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    email: [null, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    prefix: ['+39'],
    phoneNumber: [null, Validators.required],
    gender: this.fb.control('0'),
    password: [null, [Validators.required]],
    confirmPassword: [null],
    address: this.fb.group({
      road: [null, Validators.required],
      civic: [null, Validators.required],
      cityAutocomplete: [null, Validators.required],
      city: [null],
      province: null
    })
  })

  protected errorMsg: RegisterErrorMsg = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    password: '',
    confirmPassword: '',
    road: '',
    civic: '',
    cityAutocomplete: ''
  }

  private setInvalidMessages(fieldName: string): string {
    const field: AbstractControl | null = this.registerForm.get(fieldName)
    let errorMsg = ''
    if (field) {
      if (field.errors) {
        if (field.errors['required'] && fieldName === 'email' && field.dirty) errorMsg += 'Email obbligatoria. '
        if (field.errors['required'] && fieldName === 'password' && field.dirty) errorMsg += 'Password obbligatoria. '
        if (field.errors['pattern']) errorMsg += 'Formato email errato. '
      }

    }
    return errorMsg
  }

  protected isValid(fieldName: string) {
    return this.registerForm.get(fieldName)?.valid && this.registerForm.get(fieldName)?.dirty
  }

  protected isInvalid(fieldName: string) {
    return !this.registerForm.get(fieldName)?.valid && this.registerForm.get(fieldName)?.dirty
  }

  protected performRegister(): void {
    if (this.registerForm.valid) {
      this.authSvc.login(this.registerForm.value).subscribe(

        res => {
          console.log('register ok')
        },
        err => {

        }
      )
    } else {
      Object.values(this.registerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}
