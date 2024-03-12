import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyPizzaRoutingModule } from './my-pizza-routing.module';
import { MyPizzaComponent } from './my-pizza.component';


@NgModule({
  declarations: [
    MyPizzaComponent
  ],
  imports: [
    CommonModule,
    MyPizzaRoutingModule
  ]
})
export class MyPizzaModule { }
