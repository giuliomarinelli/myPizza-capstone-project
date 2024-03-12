import { MyPizzaGesShComponentsModule } from './../../../my-pizza-ges-sh-components/my-pizza-ges-sh-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AggiungiProdottiRoutingModule } from './aggiungi-prodotti-routing.module';
import { AggiungiProdottiComponent } from './aggiungi-prodotti.component';


@NgModule({
  declarations: [
    AggiungiProdottiComponent
  ],
  imports: [
    CommonModule,
    AggiungiProdottiRoutingModule,
    MyPizzaGesShComponentsModule
  ]
})
export class AggiungiProdottiModule { }
