import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyPizzaGesRoutingModule } from './my-pizza-ges-routing.module';
import { MyPizzaGesComponent } from './my-pizza-ges.component';


@NgModule({
  declarations: [
    MyPizzaGesComponent
  ],
  imports: [
    CommonModule,
    MyPizzaGesRoutingModule
  ]
})
export class MyPizzaGesModule { }
