import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessioneRoutingModule } from './sessione-routing.module';
import { SessioneComponent } from './sessione.component';


@NgModule({
  declarations: [
    SessioneComponent
  ],
  imports: [
    CommonModule,
    SessioneRoutingModule
  ]
})
export class SessioneModule { }
