import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private fb: FormBuilder, private authSvc: AuthService, private router: Router) { }

  protected errorMsg: string = ''

  protected loginErrorMsg: string = ''

  protected valid!: boolean

  protected validLogin: boolean = true

  private path: string = ''

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof RoutesRecognized) this.path = event.url
    })
  }

  ngDoCheck() {
    this.errorMsg = `${this.setInvalidMessages('email')}${this.setInvalidMessages('password')}`
    this.valid = this.loginForm['valid']
  }

  protected loginForm: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    password: [null, [Validators.required]]
  })

  private setInvalidMessages(fieldName: string): string {
    const field: AbstractControl | null = this.loginForm.get(fieldName)
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
    return this.loginForm.get(fieldName)?.valid && this.loginForm.get(fieldName)?.dirty
  }

  protected isInvalid(fieldName: string) {
    return !this.loginForm.get(fieldName)?.valid && this.loginForm.get(fieldName)?.dirty
  }

  protected performLogin(): void {
    if (this.loginForm.valid) {
      this.authSvc.login(this.loginForm.value).subscribe(
        res => {

          this.authSvc.loggedInSbj.next(true)
          this.authSvc.isAdmin().subscribe(res => {
            this.authSvc.adminSbj.next(true)
            if (this.path === '/login') this.router.navigate(['/my-pizza-ges'])
            location.reload()
          },
        err =>this.authSvc.adminSbj.next(false) )
          if (this.path === '/login') this.router.navigate(['/my-pizza'])
          location.reload()
        },
        err => {
          this.validLogin = false
          console.log(err.error.message)
          if (err.error.message === 'Email and/or password are incorrect') this.loginErrorMsg = 'Email o password errate'
          console.log(this.errorMsg)
        }
      )
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


}
