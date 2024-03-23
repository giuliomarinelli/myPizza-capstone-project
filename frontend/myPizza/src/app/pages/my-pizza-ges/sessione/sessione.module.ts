import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxRerenderModule } from 'ngx-rerender'
import { SessioneRoutingModule } from './sessione-routing.module';
import { SessioneComponent } from './sessione.component';
import { SharedComponentsModule } from '../../../shared-components/shared-components.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MyPizzaGesShComponentsModule } from '../../../my-pizza-ges-sh-components/my-pizza-ges-sh-components.module';
import { ConfirmOrderDialogComponent } from './confirm-order-dialog/confirm-order-dialog.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@NgModule({
  declarations: [
    SessioneComponent,
    ConfirmOrderDialogComponent
  ],
  imports: [
    CommonModule,
    SessioneRoutingModule,
    NgxRerenderModule,
    SharedComponentsModule,
    MatIconModule,
    MatDialogModule,
    MyPizzaGesShComponentsModule,
    CdkAccordionModule
  ]
})
export class SessioneModule { }
