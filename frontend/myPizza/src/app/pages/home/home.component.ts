import { Component, afterNextRender } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { error } from 'console';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private authSvc: AuthService) {
    afterNextRender(() => {
      authSvc.isLoggedInQuery().subscribe({
        next: (res) => {
          console.log('loggato')
          console.log(res)
        },
        error: (err) => console.log(err.error)
      })
    })
  }
}
