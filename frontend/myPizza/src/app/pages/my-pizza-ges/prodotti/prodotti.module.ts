import { SharedComponentsModule } from './../../../shared-components/shared-components.module';
import { MyPizzaGesShComponentsModule } from './../../../my-pizza-ges-sh-components/my-pizza-ges-sh-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdottiRoutingModule } from './prodotti-routing.module';
import { ProdottiComponent } from './prodotti.component';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ProductManagerNavComponent } from '../product-manager-nav/product-manager-nav.component';
import { MyPizzaGesModule } from '../my-pizza-ges.module';

@NgModule({
  declarations: [
    ProdottiComponent
  ],
  imports: [
    CommonModule,
    ProdottiRoutingModule,
    MyPizzaGesShComponentsModule,
    SharedComponentsModule,
    InfiniteScrollModule,
    MyPizzaGesModule
  ]
})
export class ProdottiModule { }
