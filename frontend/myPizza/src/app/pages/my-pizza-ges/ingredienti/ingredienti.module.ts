import { SharedComponentsModule } from './../../../shared-components/shared-components.module';
import { MyPizzaGesShComponentsModule } from './../../../my-pizza-ges-sh-components/my-pizza-ges-sh-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngredientiRoutingModule } from './ingredienti-routing.module';
import { IngredientiComponent } from './ingredienti.component';
import { MyPizzaGesModule } from '../my-pizza-ges.module';


@NgModule({
  declarations: [
    IngredientiComponent
  ],
  imports: [
    CommonModule,
    IngredientiRoutingModule,
    MyPizzaGesShComponentsModule,
    SharedComponentsModule,
    MyPizzaGesModule
  ]
})
export class IngredientiModule { }
