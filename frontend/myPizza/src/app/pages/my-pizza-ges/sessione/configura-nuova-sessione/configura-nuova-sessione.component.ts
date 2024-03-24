import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { SessionService } from '../../../../services/session.service';
import { IsThereAnActiveSessionRes, StartSessionDTO, TimeInterval } from './../../../../Models/i_session';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID, afterNextRender } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-configura-nuova-sessione',
  templateUrl: './configura-nuova-sessione.component.html',
  styleUrl: './configura-nuova-sessione.component.scss'
})
export class ConfiguraNuovaSessioneComponent {
  constructor(private authSvc: AuthService,
    private _session: SessionService, private router: Router,
    private ngZone: NgZone, private fb: FormBuilder, private appRef: ApplicationRef) {

    afterNextRender(() => {



      _session.isThereAnActiveSession().subscribe(res => {
        this.isThereAnActiveSession = res
        if (res === true) {
          this.isLoading = false
          appRef.tick()
          ngZone.run(() => router.navigate(['my-pizza-ges/sessione']))
        } else {
          this.isLoading = false
          appRef.tick()
        }
      })



    })
  }

  protected startSessionForm: FormGroup = this.fb.group({
    openH: this.fb.control('HH'),
    openM: this.fb.control('MM'),
    closeH: this.fb.control('HH'),
    closeM: this.fb.control('MM'),
    cookCount: this.fb.control(null, [Validators.required]),
    ridersCount: this.fb.control(null, [Validators.required]),
    type: this.fb.control('none')
  })

  protected isLoading: boolean = true

  protected timeIntervals: TimeInterval[] = []

  protected isOk: boolean = false

  protected isAdmin: boolean = false

  protected isThereAnActiveSession: boolean = false

  protected generateNumberValue(i: number): string {
    if (i == 0) return '00'
    return i < 10 ? '0' + i : String(i)
  }

  protected minutes: number[] = [0, 15, 30, 45]

  protected hours: number[] = []

  ngOnInit() {
    for (let i: number = 0; i < 24; i++) {
      this.hours.push(i)
    }
  }

  private markAsDirtyAndUpdateValueAndValidity(control: AbstractControl): void {
    control.markAsDirty();
    control.updateValueAndValidity({ onlySelf: true });
  }

  private markAll(): void {
    Object.values(this.startSessionForm.controls).forEach(control => {
      if (control.invalid) {
        this.markAsDirtyAndUpdateValueAndValidity(control)
      }

    });
  }

  protected performSubmit(): void {
    if (this.startSessionForm.valid) {
      // type: string
      // openTime: number
      // closeTime: number
      // cookCount: number
      // ridersCount: number

      // openH: this.fb.control('HH'),
      // openM: this.fb.control('MM'),
      // closeH: this.fb.control('HH'),
      // closeM: this.fb.control('MM'),
      // cookCount: this.fb.control(null, [Validators.required]),
      // ridersCount: this.fb.control(null, [Validators.required]),
      // type: this.fb.control('none')
      const openTimeD = new Date()
      openTimeD.setHours(Number(this.startSessionForm.get('openH')?.value))
      openTimeD.setMinutes(Number(this.startSessionForm.get('openM')?.value))
      const openTime = openTimeD.getTime()
      const closeTimeD = new Date()
      closeTimeD.setHours(Number(this.startSessionForm.get('closeH')?.value))
      closeTimeD.setMinutes(Number(this.startSessionForm.get('closeM')?.value))
      const closeTime = closeTimeD.getTime() > openTime ? closeTimeD.getTime() : closeTimeD.setTime(closeTimeD.getTime() + 86400000)
      const submit: StartSessionDTO = {
        openTime,
        closeTime,
        cookCount: <number>this.startSessionForm.get('cookCount')?.value,
        ridersCount: <number>this.startSessionForm.get('ridersCount')?.value,
        type: this.startSessionForm.get('type')?.value
      }
      this._session.startNewSession(submit).subscribe({
        next: res => {
          this.timeIntervals = res.timeIntervals
          this.isOk = true
        },
        error: err => console.log(err)
      })

      console.log(submit)
    } else {
      this.markAll()

    }
  }




}
