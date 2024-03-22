import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ConfiguraNuovaSessioneRoutingModule } from './configura-nuova-sessione-routing.module';
import { ConfiguraNuovaSessioneComponent } from './configura-nuova-sessione.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IgxTimePickerModule } from 'igniteui-angular';

@NgModule({
  declarations: [
    ConfiguraNuovaSessioneComponent,

  ],
  imports: [
    CommonModule,
    ConfiguraNuovaSessioneRoutingModule,
    NgxMaterialTimepickerModule,
    ReactiveFormsModule
  ]
})
export class ConfiguraNuovaSessioneModule { }
