import { Component, Inject, PLATFORM_ID, ViewChild, afterNextRender } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { iLink } from './Models/i-link';
import { ThemePalette } from '@angular/material/core';
import { Router, RoutesRecognized } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './services/auth.service';
import { User } from './Models/i-user';
import { SocketService } from './services/socket.service';

@Component({
  selector: '#root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: string, private authSvc: AuthService, private socket: SocketService) {

    afterNextRender(() => {

      this.authSvc.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          if (!socket.connected) {
            this.authSvc.isWsAuthValidOrRefresh().subscribe(res => {
              socket.connect()
            })
          } this.isLoggedIn = true
          this.getProfile()
          this.authSvc.isAdmin().subscribe(isAdmin => {
            this.authSvc.adminSbj.next(isAdmin)
            this.isAdmin = true
          },
            err => this.accessDenied = true
          )
        } else {
          this.authSvc.isLoggedInQuery().subscribe(res => {
            if (!socket.connected) {
              this.authSvc.isWsAuthValidOrRefresh().subscribe(res => {
                socket.connect()
              })
            }
            this.isLoggedIn = res.loggedIn
            this.authSvc.loggedInSbj.next(res.loggedIn)
            this.authSvc.isAdmin().subscribe(isAdmin => this.authSvc.adminSbj.next(isAdmin))
            this.getProfile()
          },
            err => this.showLogIn = true)
        }
      })
    })
  }

  protected brand: string = 'MyPizza'

  isLoginPath = false

  protected showLogIn = false

  protected isLoggedIn = false

  protected userProfile!: User
  protected userSuffix!: string

  protected accessDenied = false

  protected isAdminPath = false

  protected isAdmin = false

  protected logout(): void {
    this.authSvc.logout().subscribe(res => this.isLoggedIn = false)
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

  protected isHome!: boolean
  protected activeLink!: iLink

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }




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

  protected background: ThemePalette = undefined;
  ngOnInit() {

    for (let i: number = 0; i < 3; i++) this.smMdLinks.push(this.links[i])
    this.router.events.subscribe((event) => {
      if (event instanceof RoutesRecognized) {
        this.activeLink = this.links[0]
        this.isHome = false
        const path = event.url
        if (path.startsWith('/my-pizza-ges')) this.brand = 'MyPizzaGes'
        const i = this.links.findIndex(link => link.path === path.trim())
        if (i) {
          this.activeLink = this.links[i]
          this.isHome = false
        } else if (path !== '/') {
          this.isHome = false
        } else {
          this.isHome = true
        }
        if (path.includes('my-pizza-ges')) this.isAdminPath = true
        if (path.includes('my-pizza')) this.isLoginPath = true
        console.log('path', path)
        console.log('path', this.isAdminPath)
        console.log('access denied', this.accessDenied)
        console.log(this.isHome)
      }

    })




  }
}
