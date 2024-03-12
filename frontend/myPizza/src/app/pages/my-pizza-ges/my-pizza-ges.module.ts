import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyPizzaGesRoutingModule } from './my-pizza-ges-routing.module';
import { MyPizzaGesComponent } from './my-pizza-ges.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MyPizzaGesComponent,
  ],
  imports: [
    CommonModule,
    MyPizzaGesRoutingModule,
    ReactiveFormsModule
  ]
})
export class MyPizzaGesModule { }
