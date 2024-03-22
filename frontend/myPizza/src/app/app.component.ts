import { ApplicationRef, ChangeDetectionStrategy, Component, Inject, NgZone, PLATFORM_ID, SimpleChanges, ViewChild, afterNextRender, inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { iLink, iRouteConfig } from './Models/i-link';
import { ThemePalette } from '@angular/material/core';
import { Router, RoutesRecognized } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './services/auth.service';
import { User } from './Models/i-user';
import { SocketService } from './services/socket.service';
import { Message, MessageMng } from './Models/i-message';
import { application } from 'express';
import { Order } from './Models/i-order';

@Component({
  selector: '#root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: string,
    private authSvc: AuthService, private socket: SocketService, private appRef: ApplicationRef, private ngZone: NgZone
  ) {

    afterNextRender(() => {

      this.authSvc.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {

          if (!socket.connected) {

            if (!this.isSessionPath)

              this.authSvc.isWsAuthValidOrRefresh().subscribe(res => {
                socket.connect()
                socket.onReceiveMessage().subscribe(message => {
                  if (!this.messageIds.includes(message.id)) {
                    this.messageIds.push(message.id)
                    this.count++
                    appRef.tick()
                    ngZone.runOutsideAngular(() => {
                      setTimeout(() => {
                        if (message.restore === false) {
                          this.newMessage = {
                            delete: false,
                            add: true,
                            message
                          }
                          appRef.tick()
                        }
                        this.messages.unshift(message)
                        appRef.tick()

                      }, 100)
                      ngZone.runOutsideAngular(() => {
                        setTimeout(() => this.removeMessage(), 6000)
                      })
                    })

                  }

                })
              })
            socket.restoreMessages().subscribe(ack => {
              console.log(ack)

            })
          }

          this.isLoggedIn = true
          this.showLogIn = false
          this.getProfile()
          this.authSvc.isAdmin().subscribe({
            next: isAdmin => {
              this.authSvc.adminSbj.next(isAdmin)
              this.isAdmin = true
              this.res = true
            },
            error: err => this.res = true
          }
          )
        } else {
          this.authSvc.isLoggedInQuery().subscribe({
            next: res => {
              if (!socket.connected) {
                this.authSvc.isWsAuthValidOrRefresh().subscribe(res => {
                  socket.connect()
                })
              }
              this.showLogIn = false
              this.isLoggedIn = res.loggedIn
              this.authSvc.loggedInSbj.next(res.loggedIn)
              this.authSvc.isAdmin().subscribe({
                next: isAdmin => {
                  this.authSvc.adminSbj.next(isAdmin)
                  this.accessDenied = true
                  this.res1 = true
                },
                error: err => this.res1 = true
              })
              this.getProfile()
            },
            error: err => {


            }
          })
        }
      })
    })



  }

  protected res: boolean = false
  protected res1: boolean = false
  protected res2: boolean = true

  protected orderToString(order: Order): string {
    let str: string = `<h6><strong>Ordine ${order.id}: </strong></h6><p>`
    let c = 0
    order.orderSets.forEach((os, i) => {
      if (i === 0) str += '<p><em>'
      if (i < 3) {
        str += `${os.quantity} x ${os.productRef.name}`
        if (i < 2 && i < order.orderSets.length - 1) str += ', '
      }
      if (i === 2 && i < order.orderSets.length - 1)
        str += '...'
    })
    str += '</em></p>'
    return str
  }

  protected handleRouteConfig(c: iRouteConfig): void {
    console.log(c)
    this.isHome = c.isHome
    this.brand = c.brand
    this.isAdminPath = c.isAdminPath
    this.isSessionPath = c.isSessionPath
    this.activeLink = this.links[c.activeLinkIndex]

    if (this.isAdminPath) {
      this.links = this.myPizzaGesLinks
      this.resMenu = true
    } else {
      this.resMenu = true
    }
  }

  protected messageIds: string[] = []

  protected isSessionPath: boolean = false

  protected count: number = 0

  protected resMenu: boolean = false


  protected removeMessage() {
    if (this.newMessage) {
      this.appRef.tick()
      this.newMessage.delete = true
      setTimeout(() => {
        this.appRef.tick()
        this.newMessage = undefined
      }, 500)

    }
  }



  protected newMessage: MessageMng | undefined = undefined

  protected messages: Message[] = []

  private path = ''

  protected brand: string = 'MyPizza'

  isLoginPath = false

  protected showLogIn = true

  protected isLoggedIn = false

  protected userProfile!: User
  protected userSuffix!: string

  protected accessDenied = false

  protected isAdminPath = false

  protected isAdmin = false

  protected logout(): void {
    this.authSvc.logout().subscribe(res => {
      this.isLoggedIn = false
      location.href = location.href
    })
  }

  protected get useClient(): boolean {
    return isPlatformBrowser(this.platformId)
  }

  private getProfile() {
    this.authSvc.getProfile().subscribe(res => {
      this.userSuffix = res.gender === 'M' ? 'o' : 'a'
      this.userProfile = res
    })
  }

  @ViewChild('sidenav') sidenav!: MatSidenav;

  reason = '';

  protected isHome: boolean = false
  protected activeLink!: iLink

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }



  protected myPizzaGesLinks: iLink[] = [
    {
      name: 'gestione menu',
      path: 'my-pizza-ges/prodotti'
    },
    {
      name: 'sessione lavorativa',
      path: 'my-pizza-ges/sessione'
    },
    {
      name: 'impostazioni',
      path: 'my-pizza-ges/impostazioni'
    }
  ]

  protected links: iLink[] = [
    {
      name: 'home',
      path: '/'
    },
    {
      name: 'ordina',
      path: '/ordina-a-domicilio'
    },
    {
      name: 'la pizzeria',
      path: '/la-nostra-pizzeria'
    },
    {
      name: 'il menu',
      path: '/il-nostro-menu'
    }
  ]

  protected smMdLinks: iLink[] = []
  protected mbSmLinks: iLink[] = []

  protected background: ThemePalette = undefined;
  ngOnInit() {
    for (let i: number = 0; i < 3; i++) this.smMdLinks.push(this.links[i])
    for (let i: number = 0; i < 2; i++) this.mbSmLinks.push(this.links[i])
    this.activeLink = this.links[0]
  }

}

