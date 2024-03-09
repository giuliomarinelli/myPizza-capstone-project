import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdinaADomicilioRoutingModule } from './ordina-a-domicilio-routing.module';
import { OrdinaADomicilioComponent } from './ordina-a-domicilio.component';


@NgModule({
  declarations: [
    OrdinaADomicilioComponent
  ],
  imports: [
    CommonModule,
    OrdinaADomicilioRoutingModule
  ]
})
export class OrdinaADomicilioModule { }
