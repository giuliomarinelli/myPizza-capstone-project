import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessioneLavorativaRoutingModule } from './sessione-lavorativa-routing.module';
import { SessioneLavorativaComponent } from './sessione-lavorativa.component';
import { NgxRerenderModule } from 'ngx-rerender';
import { AuthComponentsModule } from '../../../auth-components/auth-components.module';


@NgModule({
  declarations: [
    SessioneLavorativaComponent
  ],
  imports: [
    CommonModule,
    SessioneLavorativaRoutingModule,
    NgxRerenderModule,
    AuthComponentsModule
  ]
})
export class SessioneLavorativaModule { }
