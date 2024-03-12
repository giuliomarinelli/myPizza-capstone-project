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
    AggiungiProdottiRoutingModule
  ]
})
export class AggiungiProdottiModule { }
