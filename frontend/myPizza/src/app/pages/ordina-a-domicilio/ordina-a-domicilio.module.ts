import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdinaADomicilioRoutingModule } from './ordina-a-domicilio-routing.module';
import { OrdinaADomicilioComponent } from './ordina-a-domicilio.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatIconModule } from '@angular/material/icon';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OrdinaADomicilioComponent
  ],
  imports: [
    CommonModule,
    OrdinaADomicilioRoutingModule,
    InfiniteScrollModule,
    MatIconModule,
    SharedComponentsModule,
    FormsModule
  ]
})
export class OrdinaADomicilioModule { }
