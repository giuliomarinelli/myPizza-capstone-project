import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModificaProdottiRoutingModule } from './modifica-prodotti-routing.module';
import { ModificaProdottiComponent } from './modifica-prodotti.component';


@NgModule({
  declarations: [
    ModificaProdottiComponent
  ],
  imports: [
    CommonModule,
    ModificaProdottiRoutingModule
  ]
})
export class ModificaProdottiModule { }
