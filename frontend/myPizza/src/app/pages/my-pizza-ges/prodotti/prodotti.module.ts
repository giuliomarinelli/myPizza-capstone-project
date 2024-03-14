import { SharedComponentsModule } from './../../../shared-components/shared-components.module';
import { MyPizzaGesShComponentsModule } from './../../../my-pizza-ges-sh-components/my-pizza-ges-sh-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdottiRoutingModule } from './prodotti-routing.module';
import { ProdottiComponent } from './prodotti.component';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

@NgModule({
  declarations: [
    ProdottiComponent
  ],
  imports: [
    CommonModule,
    ProdottiRoutingModule,
    MyPizzaGesShComponentsModule,
    SharedComponentsModule,
    InfiniteScrollModule
  ]
})
export class ProdottiModule { }
