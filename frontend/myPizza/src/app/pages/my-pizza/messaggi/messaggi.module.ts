import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MessaggiRoutingModule } from './messaggi-routing.module';
import { MessaggiComponent } from './messaggi.component';


@NgModule({
  declarations: [
    MessaggiComponent
  ],
  imports: [
    CommonModule,
    MessaggiRoutingModule,
    MatTabsModule
  ]
})
export class MessaggiModule { }
