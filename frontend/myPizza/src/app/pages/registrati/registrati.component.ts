import { RegisterErrorMsg } from './../../Models/i-register-error-msg';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AddressRegisterDTO, UserPostDTO, UserRegister } from '../../Models/user-dto';
import { PublicApiService } from '../../services/public-api.service';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { log } from 'console';
import { CityAutocomplete } from '../../Models/i-city-autocomplete';

@Component({
    selector: 'app-registrati',
    templateUrl: './registrati.component.html',
    styleUrl: './registrati.component.scss'
})
export class RegistratiComponent {

    constructor(private fb: FormBuilder, private authSvc: AuthService, private publicApiSvc: PublicApiService) { }

    protected internationalPrefixList!: string[]
    protected unmatch: boolean = false
    protected match: boolean = false

    protected citySetOptions!: CityAutocomplete[]


    ngDoCheck() {

        this.errorMsg = {
            firstName: this.setInvalidMessages('firstName', false),
            lastName: this.setInvalidMessages('lastName', false),
            email: this.setInvalidMessages('email', false),
            phoneNumber: this.setInvalidMessages('phoneNumber', false),
            gender: '',
            password: this.setInvalidMessages('password', false),
            confirmPassword: (this.registerForm.controls['confirmPassword'].value !== this.registerForm.controls['password'].value) && (this.registerForm.controls['confirmPassword'].dirty) ? 'Le 2 password non corrispondono' : this.setInvalidMessages('confirmPassword', false),
            road: this.setInvalidMessages('road', true),
            civic: this.setInvalidMessages('civic', true),
            cityAutocomplete: this.setInvalidMessages('cityAutocomplete', true),
        }

        if (!this.registerForm.get('address.city')?.value ||
            !this.registerForm.get('address.province')?.value || !this.registerForm.get('address.cityAutocomplete')?.value) {
            this.registerForm.get('address.cityAutocomplete')?.setErrors({ unselectedCity: true })
        }
        if (this.registerForm.controls['confirmPassword'].value !== this.registerForm.controls['password'].value && this.registerForm.controls['confirmPassword'].dirty) {
            this.unmatch = true
        } else {
            this.unmatch = false
        }

        if (this.registerForm.controls['confirmPassword'].value === this.registerForm.controls['password'].value && this.registerForm.controls['confirmPassword'].dirty) {
            this.match = true
        } else {
            this.match = false
        }
    }

    ngOnInit() {
        this.publicApiSvc.getAllInternationalPrefixes().subscribe(res => {
            const ind = res.findIndex(p => p === '+39')
            res.splice(ind, 1)
            this.internationalPrefixList = res
        })


    }

    protected onCityInput() {
        const q: string = this.registerForm.value['address']['cityAutocomplete']
        if (q.length > 1) {
            this.publicApiSvc.cityAutocomplete(q).subscribe(res => {
                this.citySetOptions = res
            })
        } else {
            this.citySetOptions = []
        }
    }

    protected setCity(event: MatAutocompleteSelectedEvent) {
        const value: string = event.option.value
        const selectedOption: CityAutocomplete | undefined = this.citySetOptions.find(el => el.autocomplete === value)
        if (selectedOption) {
            this.registerForm.get('address.city')?.setValue(selectedOption.name)
            this.registerForm.get('address.province')?.setValue(selectedOption.provinceCode)
        }
    }

    protected registerForm: FormGroup = this.fb.group({
        firstName: this.fb.control(null, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]*$/)]),
        lastName: this.fb.control(null, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]*$/)]),
        email: this.fb.control(null, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
        prefix: this.fb.control('+39'),
        phoneNumber: this.fb.control(null, [Validators.required, Validators.pattern(/^[0-9]/)]),
        gender: this.fb.control('0'),
        password: this.fb.control(null, [Validators.required]),
        confirmPassword: this.fb.control(null, Validators.required),
        address: this.fb.group({
            road: this.fb.control(null, [Validators.required]),
            civic: this.fb.control(null, [Validators.required]),
            cityAutocomplete: this.fb.control(null, [Validators.required]),
            city: this.fb.control(null),
            province: this.fb.control(null)
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

    private setInvalidMessages(fieldName: string, address: boolean): string {
        const _fieldName = address ? `address.${fieldName}` : fieldName
        const field: AbstractControl | null = this.registerForm.get(_fieldName)
        console.log(fieldName, field)
        let errorMsg = ''
        if (field) {
            if (field.errors) {
                if (field.errors['required'] && fieldName === 'firstName' && field.dirty) errorMsg += 'Il nome è obbligatorio. '
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
        return this.registerForm.get(fieldName)?.valid && this.registerForm.get(fieldName)?.dirty
    }

    protected isInvalid(fieldName: string) {
        return !this.registerForm.get(fieldName)?.valid && this.registerForm.get(fieldName)?.dirty
    }


    protected isGenderInvalid(): boolean | undefined {
        const res: boolean | undefined = this.registerForm.get('gender')?.value === '0' && this.registerForm.get('gender')?.dirty
        return res
    }

    private markAsDirtyAndUpdateValueAndValidity(control: AbstractControl): void {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
    }

    private markAll(): void {
        Object.values(this.registerForm.controls).forEach(control => {
            if (control.invalid) {
                this.markAsDirtyAndUpdateValueAndValidity(control)
            }
            const road: AbstractControl | null = this.registerForm.get('address.road')
            const civic: AbstractControl | null = this.registerForm.get('address.civic')
            const cityAutocomplete: AbstractControl | null = this.registerForm.get('address.cityAutocomplete')
            if (this.registerForm.get('gender')?.value === '0') this.registerForm.get('gender')?.markAsDirty()
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

    protected performRegister(): void {
        console.log(this.registerForm)
        if (this.registerForm.valid) {
            if (this.registerForm.get('gender')?.value === '0') {
                this.markAll()
                return
            }

            const submit: UserRegister = this.registerForm.value
            submit.phoneNumber = submit.prefix + submit.phoneNumber
            const { prefix, confirmPassword, address, ...otherProps } = submit
            const { cityAutocomplete, ...othersAddress } = address
            const userPostDTO: UserPostDTO = {
                ...otherProps,
                address: { ...othersAddress }
            }



            this.authSvc.register(userPostDTO).subscribe(

                res => {
                    console.log(res)
                },
                err => {
                    console.log(err.error)
                }
            )
        } else {
            this.markAll()

        }
    }

}
