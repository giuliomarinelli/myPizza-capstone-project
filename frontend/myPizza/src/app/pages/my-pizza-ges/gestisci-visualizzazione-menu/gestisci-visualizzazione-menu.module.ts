import { MyPizzaGesShComponentsModule } from './../../../my-pizza-ges-sh-components/my-pizza-ges-sh-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestisciVisualizzazioneMenuRoutingModule } from './gestisci-visualizzazione-menu-routing.module';
import { GestisciVisualizzazioneMenuComponent } from './gestisci-visualizzazione-menu.component';
import { SharedComponentsModule } from '../../../shared-components/shared-components.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MyPizzaGesModule } from '../my-pizza-ges.module';


@NgModule({
  declarations: [
    GestisciVisualizzazioneMenuComponent
  ],
  imports: [
    CommonModule,
    GestisciVisualizzazioneMenuRoutingModule,
    MyPizzaGesShComponentsModule,
    SharedComponentsModule,
    InfiniteScrollModule,
    CdkDropList,
    CdkDrag,
    DragDropModule,
    MatIconModule,
    MyPizzaGesModule
  ]
})
export class GestisciVisualizzazioneMenuModule { }
