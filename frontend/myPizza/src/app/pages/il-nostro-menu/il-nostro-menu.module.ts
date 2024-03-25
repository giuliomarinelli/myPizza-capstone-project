import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IlNostroMenuRoutingModule } from './il-nostro-menu-routing.module';
import { IlNostroMenuComponent } from './il-nostro-menu.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';


@NgModule({
  declarations: [
    IlNostroMenuComponent
  ],
  imports: [
    CommonModule,
    IlNostroMenuRoutingModule,
    InfiniteScrollModule,
    SharedComponentsModule
  ]
})
export class IlNostroMenuModule { }
