import { Component, Inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { Menu } from '../../../Models/i-menu';
import { MenuService } from '../../../services/menu.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-gestisci-visualizzazione-menu',
  templateUrl: './gestisci-visualizzazione-menu.component.html',
  styleUrl: './gestisci-visualizzazione-menu.component.scss'
})
export class GestisciVisualizzazioneMenuComponent {

  constructor(private authSvc: AuthService, private productSvc: ProductService, private menuSvc: MenuService,
    @Inject(PLATFORM_ID) private platformId: string) {

    afterNextRender(() => {
      this.authSvc.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn && this._onlyOnce) {
          this.authSvc.isAdmin$.subscribe(isAdmin => {
            if (isAdmin) {
              console.log('accesso admin concesso')
              this.isAdmin = true
            } else {
              console.log('accesso negato, miss permissions')
            }
          })
        } else (console.log('accesso negato: non loggato'))
      })

    })
  }

  protected isLoading: boolean = true

  protected count: number = 0

  protected noEdit: boolean = false

  protected isAdmin: boolean = false

  private _onlyOnce: boolean = true

  protected onlyOnce: boolean[] = []

  protected menu: Menu[] = []

  protected get useClient(): boolean {
    return isPlatformBrowser(this.platformId)
  }


  ngDoCheck() {
    if (this.isAdmin && this._onlyOnce) {

      this._onlyOnce = false

      this.menuSvc.getMenu(25).subscribe(res => {

        res.content.forEach(m => {
          this.menu.push(m)
          this.onlyOnce.push(true)
        })

        this.isLoading = false

      })
    }
  }

  protected drop(event: CdkDragDrop<Menu[]>) {
    moveItemInArray(this.menu, event.previousIndex, event.currentIndex)
    this.noEdit = true
  }

  protected onScroll() {

    if (this.onlyOnce[this.count]) {

      this.isLoading = true
      this.onlyOnce[this.count] = false
      setTimeout(() => {
        this.menuSvc.getMenu(25, this.count).subscribe(res => {
          res.content.forEach(el => {
            this.menu.push(el)
          })
          this.isLoading = false
        })
      }, 800)

      this.count++


    }


  }
}
