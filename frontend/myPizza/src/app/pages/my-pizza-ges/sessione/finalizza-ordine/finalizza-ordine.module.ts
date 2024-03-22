import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinalizzaOrdineRoutingModule } from './finalizza-ordine-routing.module';
import { FinalizzaOrdineComponent } from './finalizza-ordine.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../../../../shared-components/shared-components.module';


@NgModule({
  declarations: [
    FinalizzaOrdineComponent
  ],
  imports: [
    CommonModule,
    FinalizzaOrdineRoutingModule,
    ReactiveFormsModule,
    SharedComponentsModule

  ]
})
export class FinalizzaOrdineModule { }
