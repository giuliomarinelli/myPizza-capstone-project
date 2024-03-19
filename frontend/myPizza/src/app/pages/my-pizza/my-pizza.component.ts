import { ApplicationRef, Component, afterNextRender } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-my-pizza',
  templateUrl: './my-pizza.component.html',
  styleUrl: './my-pizza.component.scss'
})
export class MyPizzaComponent {
  constructor(private appRef: ApplicationRef) {
    afterNextRender(() => {
      appRef.tick()
    })
  }
}
