import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IlNostroMenuRoutingModule } from './il-nostro-menu-routing.module';
import { IlNostroMenuComponent } from './il-nostro-menu.component';


@NgModule({
  declarations: [
    IlNostroMenuComponent
  ],
  imports: [
    CommonModule,
    IlNostroMenuRoutingModule
  ]
})
export class IlNostroMenuModule { }
