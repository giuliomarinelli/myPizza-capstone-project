import { ApplicationRef, Component, afterNextRender } from '@angular/core';
import { SocketService } from '../../../services/socket.service';
import { Message } from '../../../Models/i-message';

@Component({
  selector: 'app-sessione-lavorativa',
  templateUrl: './sessione-lavorativa.component.html',
  styleUrl: './sessione-lavorativa.component.scss'
})
export class SessioneLavorativaComponent {

  constructor(private socket: SocketService, private appRef: ApplicationRef) {
    afterNextRender(() => {
      socket.connect()
      socket.onReceiveMessage().subscribe(res => {
        this.realTimeMessages.unshift(res)
        appRef.tick()
      })
    })
  }

  protected realTimeMessages: Message[] = []

  protected trigger = 0

}
