import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxRerenderModule } from 'ngx-rerender'
import { SessioneRoutingModule } from './sessione-routing.module';
import { SessioneComponent } from './sessione.component';
import { SharedComponentsModule } from '../../../shared-components/shared-components.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    SessioneComponent
  ],
  imports: [
    CommonModule,
    SessioneRoutingModule,
    NgxRerenderModule,
    SharedComponentsModule,
    MatIconModule,
    MatDialogModule,
  ]
})
export class SessioneModule { }
