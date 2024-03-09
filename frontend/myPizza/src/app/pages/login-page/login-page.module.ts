
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginPageRoutingModule } from './login-page-routing.module';
import { LoginPageComponent } from './login-page.component';
import { AppModule } from '../../app.module';
import { AuthComponentsModule } from '../../auth-components/auth-components.module';




@NgModule({
  declarations: [
    LoginPageComponent
  ],
  imports: [
    CommonModule,
    LoginPageRoutingModule,
    AuthComponentsModule
  ]
})
export class LoginPageModule { }
