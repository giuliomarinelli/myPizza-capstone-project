import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MessaggiRoutingModule } from './messaggi-routing.module';
import { MessaggiComponent } from './messaggi.component';
import { SharedComponentsModule } from '../../../shared-components/shared-components.module';


@NgModule({
  declarations: [
    MessaggiComponent
  ],
  imports: [
    CommonModule,
    MessaggiRoutingModule,
    MatTabsModule,
    SharedComponentsModule
  ]
})
export class MessaggiModule { }
