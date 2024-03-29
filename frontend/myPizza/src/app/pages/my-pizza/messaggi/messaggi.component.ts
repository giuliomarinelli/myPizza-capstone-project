import { ApplicationRef, Component, NgZone, afterNextRender } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { SocketService } from '../../../services/socket.service';
import { Message } from '../../../Models/i-message';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-messaggi',
  templateUrl: './messaggi.component.html',
  styleUrl: './messaggi.component.scss'
})
export class MessaggiComponent {

  constructor(private authSvc: AuthService, private socket: SocketService, private messageSvc: MessageService,
    private appRef: ApplicationRef, private ngZone: NgZone) {
    afterNextRender(() => {
      this.loader()
      authSvc.isLoggedInQuery().subscribe({
        next: res => {
          socket.restoreMessages().subscribe(ack => {
            console.log(ack)
          })

          socket.onGetUnreadMessagesCount().subscribe(count => {
            if (this.activeTab === 'messaggi non letti' && count === 0) this.isLoading = false
          })
          socket.onReceiveMessage().subscribe(m => {
            if (!this.messageIds.includes(m.id)) {
              this.messageIds.push(m.id)
              this.messages.unshift(m)
              this.isLoading = false
              if (!m.read) messageSvc.messages.next(this.messages.filter(m => m.read === false).length)
              appRef.tick()
            }

          })
        },
        error: err => console.log('non autorizzato')
      })
    })
  }

  protected tabs = ['messaggi non letti', 'tutti i messaggi']
  protected activeTab: string = this.tabs[0]
  protected messages: Message[] = []
  protected messageIds: string[] = []
  protected isLoading: boolean = true


  protected loader(): void {
    // this.ngZone.run(() => setTimeout(() => this.isLoading = false, 4000))
  }

  protected perform(i: number) {
    this.messageIds = []
    this.messages = []
    this.isLoading = true
    this.loader()
    this.appRef.tick()
    if (i === 0) {
      this.socket.getUnreadMessagesCount().subscribe(ack => console.log(ack))
      this.socket.restoreMessages().subscribe(ack => console.log(ack))
    } else if (i === 1) {
      this.socket.restoreAllMessages().subscribe(ack => console.log(ack))
    }
  }

  protected setAsRead(id: string): void {
    const ind: number = <number>this.messages.findIndex(m => m.id === id)
    this.messageSvc.setMessageReadById(id).subscribe({
      next: res => {
        if (this.activeTab === 'messaggi non letti') {
          this.messages.splice(ind, 1)
          this.messageSvc.messages.next(this.messages.length)
          this.appRef.tick()
        } else if (this.activeTab === 'tutti i messaggi') {
          this.messages[ind].read = true
          this.messageSvc.messages.next(this.messages.filter(m => !m.read).length)
          this.appRef.tick()
        }
      }
    })
  }



}
