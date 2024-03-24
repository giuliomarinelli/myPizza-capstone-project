import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForbiddenRoutingModule } from './forbidden-routing.module';
import { ForbiddenComponent } from './forbidden.component';
import { MyPizzaGesShComponentsModule } from '../../my-pizza-ges-sh-components/my-pizza-ges-sh-components.module';


@NgModule({
  declarations: [
    ForbiddenComponent
  ],
  imports: [
    CommonModule,
    ForbiddenRoutingModule,
    MyPizzaGesShComponentsModule
  ]
})
export class ForbiddenModule { }
