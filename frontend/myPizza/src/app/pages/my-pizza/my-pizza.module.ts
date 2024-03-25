import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyPizzaRoutingModule } from './my-pizza-routing.module';
import { MyPizzaComponent } from './my-pizza.component';
import { MessageCComponent } from './message-c/message-c.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';


@NgModule({
  declarations: [
    MyPizzaComponent,
    MessageCComponent
  ],
  imports: [
    CommonModule,
    MyPizzaRoutingModule,
    SharedComponentsModule
  ]
})
export class MyPizzaModule { }
