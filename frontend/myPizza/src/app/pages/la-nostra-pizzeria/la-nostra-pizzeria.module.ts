import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LaNostraPizzeriaRoutingModule } from './la-nostra-pizzeria-routing.module';
import { LaNostraPizzeriaComponent } from './la-nostra-pizzeria.component';


@NgModule({
  declarations: [
    LaNostraPizzeriaComponent
  ],
  imports: [
    CommonModule,
    LaNostraPizzeriaRoutingModule
  ]
})
export class LaNostraPizzeriaModule { }
