import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iLink, iRouteConfig } from '../Models/i-link';
import { Router, RoutesRecognized } from '@angular/router';


@Component({
  selector: 'app-route-config',
  templateUrl: './route-config.component.html',
  styleUrl: './route-config.component.scss'
})
export class RouteConfigComponent {

  constructor(private router: Router) {

  }

  @Input() public links: iLink[] = []

  @Input() public myPizzaGesLinks: iLink[] = []

  @Output() public onRouteConfig = new EventEmitter<iRouteConfig>()

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof RoutesRecognized) {
        const path = event.url
        let isHome: boolean = false
        let brand: string = 'MyPizza'
        let isAdminPath: boolean = false
        let isSessionPath: boolean = false
        let isLoginPath: boolean = false
        let isMessagePath: boolean = false
        if (path.startsWith('/my-pizza')) {
          brand = 'MyPizza'
          isLoginPath = true
        }
        if (path.startsWith('/my-pizza-ges')) {
          brand = 'MyPizzaGes'
          isAdminPath = true
        }
        if (path.includes('my-pizza-ges/sessione')) isSessionPath = true
        if (path.includes('my-pizza/messaggi')) isMessagePath = true
        let activeLinkIndex = this.links.findIndex(link => {
          let ret = false
          for (const p of link.paths) {
            if (p === path) {
              ret = true
              break;
            }
          }
          return ret
        })

        let activeMyPizzaGesLinkIndex = this.myPizzaGesLinks.findIndex(link => {
          let ret = false
          for (const p of link.paths) {
            if (p === path) {
              ret = true
              break;
            }
          }
          return ret
        })
        if (path !== '/') {
          isHome = false
        } else {
          isHome = true
        }
        if (path.includes('my-pizza-ges')) isAdminPath = true
        if (path.includes('my-pizza')) isLoginPath = true
        this.onRouteConfig.emit({
          activeLinkIndex,
          activeMyPizzaGesLinkIndex,
          isAdminPath,
          isHome,
          brand,
          isSessionPath,
          isLoginPath,
          isMessagePath
        })

      }

    })



  }
}

