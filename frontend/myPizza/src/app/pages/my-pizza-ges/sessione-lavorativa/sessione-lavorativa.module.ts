import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessioneLavorativaRoutingModule } from './sessione-lavorativa-routing.module';
import { SessioneLavorativaComponent } from './sessione-lavorativa.component';
import { NgxRerenderModule } from 'ngx-rerender';



@NgModule({
  declarations: [
    SessioneLavorativaComponent
  ],
  imports: [
    CommonModule,
    SessioneLavorativaRoutingModule,
    NgxRerenderModule
  ]
})
export class SessioneLavorativaModule { }
