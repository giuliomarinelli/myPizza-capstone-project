import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { iLink } from './Models/i-link';
import { ThemePalette } from '@angular/material/core';
import { Router, RoutesRecognized } from '@angular/router';
import { MatTabNavPanel } from '@angular/material/tabs';

@Component({
  selector: '#root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private router: Router) { }

  ngDoCheck() {

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
        const i = this.links.findIndex(link => link.path === path.trim())
        if (i) {
          this.activeLink = this.links[i]
          this.isHome = false
        } else if (path !== '/') {
          this.isHome = false
        } else {
          this.isHome = true
        }
        console.log(this.isHome)
      }

    })

  }
}
