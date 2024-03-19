import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxRerenderModule } from 'ngx-rerender'
import { SessioneRoutingModule } from './sessione-routing.module';
import { SessioneComponent } from './sessione.component';


@NgModule({
  declarations: [
    SessioneComponent
  ],
  imports: [
    CommonModule,
    SessioneRoutingModule,
    NgxRerenderModule
  ]
})
export class SessioneModule { }
