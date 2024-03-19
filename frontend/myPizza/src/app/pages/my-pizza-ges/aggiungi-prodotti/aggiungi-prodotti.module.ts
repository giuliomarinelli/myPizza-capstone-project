import { AggiungiProdottiDialogComponent } from './../aggiungi-prodotti-dialog/aggiungi-prodotti-dialog.component';
import { SharedComponentsModule } from './../../../shared-components/shared-components.module';
import { MyPizzaGesShComponentsModule } from './../../../my-pizza-ges-sh-components/my-pizza-ges-sh-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AggiungiProdottiRoutingModule } from './aggiungi-prodotti-routing.module';
import { AggiungiProdottiComponent } from './aggiungi-prodotti.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MyPizzaGesModule } from '../my-pizza-ges.module';

@NgModule({
  declarations: [
    AggiungiProdottiComponent,
    AggiungiProdottiDialogComponent
  ],
  imports: [
    CommonModule,
    AggiungiProdottiRoutingModule,
    MyPizzaGesShComponentsModule,
    SharedComponentsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    MyPizzaGesModule
  ]
})
export class AggiungiProdottiModule { }
