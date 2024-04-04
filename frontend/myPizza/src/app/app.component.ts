import { TimeInterval } from './Models/i_session';
import { IsLoggedIn } from './Models/is-logged-in';
import { ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID, SimpleChanges, ViewChild, afterNextRender, inject } from '@angular/core';
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
import { MessageService } from './services/message.service';

@Component({
  selector: '#root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: string,
    private authSvc: AuthService, private socket: SocketService, private appRef: ApplicationRef, private ngZone: NgZone,
    private messageSvc: MessageService, private change: ChangeDetectorRef, private router: Router
  ) {

    afterNextRender(async () => {




      if (!socket.connected) {

        if (!this.isSessionPath) {
          socket.connect()
          socket.getUnreadMessagesCount().subscribe(ack => console.log(ack))

        }
        socket.onGetUnreadMessagesCount().subscribe(count => {
          this.count += count
          socket.setOff()

        })

        socket.onReceiveMessage().subscribe(message => {
          if (!this.messageIds.includes(message.id) && !message.read) {
            this.messageIds.push(message.id)
            this.count++
            this.messageSvc.messages$.subscribe(n => {
              if (n !== -1) this.count = n
              appRef.tick()
              socket.setOff()


            })

            if (message.restore === false) {
              ngZone.runOutsideAngular(() => {
                setTimeout(() => {

                  this.newMessage = {
                    delete: false,
                    add: true,
                    message
                  }


                  this.messages.unshift(message)
                  appRef.tick()

                }, 100)
                ngZone.runOutsideAngular(() => {
                  setTimeout(() => this.removeMessage(), 6000)
                })
              })
            }
          }

        })


      }







    })
  }

  public trigger: number = 0;

  public rerender(): void {
    this.count = 0
    this.change.detectChanges();
    this.count = 1000
  }

  protected res: boolean = false
  protected res1: boolean = false
  protected res2: boolean = true


  private _isAdmin(): void {
    this.authSvc.isUserAdmin$.subscribe(isAdmin => {
      if (isAdmin === true) {
        console.log('is admin', isAdmin)
        this.isAdmin = true
      } else {
        this.authSvc.isAdmin().subscribe({
          next: res => {
            this.isAdmin = res
            this.authSvc.adminSbj.next(true)
          },
          error: err => err
        })
      }
    })
  }

  private _isLoggedIn(): void {
    {
      this.authSvc.isLoggedIn$.subscribe((res) => {
        if (res === true) {
          this.isLoggedIn = true
          this.getProfile()
          this._isAdmin()
        } else {
          this.authSvc.isLoggedInQuery().subscribe({
            next: res => {
              this.isLoggedIn = true
              this.getProfile()
              this._isAdmin()
              this.authSvc.loggedInSbj.next(true)
            },
            error: err => err
          })

        }
      })

    }
  }

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
    this.activeAdminLink = this.myPizzaGesLinks[c.activeMyPizzaGesLinkIndex]
    this.resMenu = true
    this.isLoginPath = c.isLoginPath
    this.isMessagePath = c.isMessagePath
    this.path = c.path
    this.appRef.tick()
  }

  protected messageIds: string[] = []

  protected isSessionPath: boolean = false

  protected count: number = 0

  protected resMenu: boolean = false



  protected removeMessage() {
    if (this.newMessage) {
      this.appRef.tick()
      this.newMessage.delete = true
      this.ngZone.runOutsideAngular(() => setTimeout(() => {
        this.newMessage = undefined
        this.appRef.tick()
      }, 500))

    }
  }

  ngAfterContentInit() {
    this._isLoggedIn()

  }

  _btoa(arg: string): string {
    return btoa(arg)
  }

  protected path: string = ''

  protected newMessage: MessageMng | undefined = undefined

  protected messages: Message[] = []

  protected brand: string = 'MyPizza'

  isLoginPath = false

  isMessagePath = false

  protected showLogIn = true

  protected isLoggedIn = false

  protected userProfile!: User
  protected userSuffix!: string

  protected accessDenied = false

  protected isAdminPath = false

  protected isAdmin = false

  protected logout(): void {

    this.authSvc.logout().subscribe(res => {
      this.authSvc.loggedInSbj.next(false)
      this.isLoggedIn = false
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
      paths: [
        '/my-pizza-ges/prodotti',
        '/my-pizza-ges/aggiungi-prodotti',
        '/my-pizza-ges/ingredienti',
        '/my-pizza-ges/gestisci-visualizzazione-menu'
      ],
      linkPath: 'my-pizza-ges/prodotti'
    },
    {
      name: 'sessione lavorativa',
      paths: ['/my-pizza-ges/sessione', '/my-pizza-ges/sessione/configura-nuova-sessione'],
      linkPath: '/my-pizza-ges/sessione'
    },
    {
      name: 'impostazioni',
      paths: ['/my-pizza-ges/impostazioni'],
      linkPath: '/my-pizza-ges/impostazioni'
    }
  ]

  protected links: iLink[] = [
    {
      name: 'home',
      paths: ['/'],
      linkPath: '/'
    },
    {
      name: 'ordina',
      paths: [
        '/ordina-a-domicilio',
        '/ordina-a-domicilio/checkout'
      ],
      linkPath: '/ordina-a-domicilio'
    },
    {
      name: 'il nostro menu',
      paths: ['/il-nostro-menu'],
      linkPath: '/il-nostro-menu'
    }
  ]

  protected smMdLinks: iLink[] = []
  protected mbSmLinks: iLink[] = []
  protected smMdAdminLinks: iLink[] = []
  protected mbSmAdminLinks: iLink[] = []
  protected activeAdminLink!: iLink

  protected background: ThemePalette = undefined;
  ngOnInit() {
    for (let i: number = 0; i < 3; i++) this.smMdLinks.push(this.links[i])
    for (let i: number = 0; i < 2; i++) this.mbSmLinks.push(this.links[i])
    for (let i: number = 0; i < 2; i++) this.smMdAdminLinks.push(this.myPizzaGesLinks[i])
    for (let i: number = 0; i < 1; i++) this.mbSmAdminLinks.push(this.myPizzaGesLinks[i])
    this.activeAdminLink = this.myPizzaGesLinks[0],
      this.activeLink = this.links[0]

  }

}

