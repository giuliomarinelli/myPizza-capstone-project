import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import { RegistratiRoutingModule } from './registrati-routing.module';
import { RegistratiComponent } from './registrati.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RegistratiComponent
  ],
  imports: [
    CommonModule,
    RegistratiRoutingModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ]
})
export class RegistratiModule { }
