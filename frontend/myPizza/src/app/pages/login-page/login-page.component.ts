import { IsLoggedIn } from './../../Models/is-logged-in';
import { ApplicationRef, Component, NgZone, afterNextRender } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'section#login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  constructor(private fb: FormBuilder, private authSvc: AuthService, private ngZone: NgZone,
    private router: Router, private socket: SocketService, private appRef: ApplicationRef, private route: ActivatedRoute) {
    afterNextRender(() => {
      console.log('login page')
      this.route.queryParams.subscribe(params => {
        if (params['ref']) {
          const ref = <string>params['ref']
          this.refUrl = atob(ref)
          if (params['act']) {
            console.log('LOGOUT')
            const act = <string>params['act']
            if (atob(act) === 'LOGOUT') this.authSvc.logout().subscribe(res => {
              ngZone.run(() => {
                location.href = '/login?ref=' + ref
             })
            })
          }
        }
      })
    })
  }

  protected submit: boolean = false

  protected errorMsg: string = ''

  protected loginErrorMsg: string = ''

  protected valid!: boolean

  protected validLogin: boolean = true

  private path: string = this.router.url

  protected refUrl: string = ''



  ngDoCheck() {
    this.errorMsg = `${this.setInvalidMessages('email')}${this.setInvalidMessages('password')}`
    this.valid = this.loginForm['valid']
  }

  protected loginForm: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    password: [null, [Validators.required]],
    restore: [false]
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
      this.submit = true

      console.log(this.loginForm.value)
      this.authSvc.login(this.loginForm.value).subscribe({
        next: res => {
          this.socket.connect()
          this.authSvc.loggedInSbj.next(true)
          this.authSvc.getAuthorities().subscribe(auth => {
            if (auth.includes('ADMIN')) {
              this.authSvc.adminSbj.next(true)
              this.refUrl ? this.router.navigate([this.refUrl]) : this.router.navigate(['/my-pizza-ges/prodotti'])
            } else {
              this.refUrl ? this.router.navigate([this.refUrl]) : this.router.navigate(['/ordina-a-domicilio'])
            }
          })

          this.appRef.tick()


        },
        error: err => {
          this.validLogin = false
          this.submit = false
          if (err.error.message === 'Email and/or password are incorrect') this.loginErrorMsg = 'Email o password errate'
        }
      })


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
