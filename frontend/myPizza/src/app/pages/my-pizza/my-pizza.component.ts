import { ApplicationRef, Component, afterNextRender } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';
import { Address, User } from '../../Models/i-user';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-my-pizza',
  templateUrl: './my-pizza.component.html',
  styleUrl: './my-pizza.component.scss'
})
export class MyPizzaComponent {
  constructor(private appRef: ApplicationRef, authSvc: AuthService) {
    afterNextRender(() => {
      authSvc.getProfile().subscribe({next: res => {
        this.profile = res
        authSvc.getAddresses().pipe(map(res => res.find(add => add._default))).subscribe(res => {
          this.address = <Address>res
          this.isLoading = false
          appRef.tick()
        })
        console.log(res);

        this.suffix = res.gender === 'M' ? 'o' : 'a'
      }, error: err => err})
    })
  }

  protected address!: Address

  protected isLoading: boolean = true

  protected suffix!: string

  protected profile!: User
}
