import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSaveComponent } from './product-save/product-save.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductsComponent } from './products/products.component';


@NgModule({
  declarations: [
    ProductSaveComponent,
    ProductCardComponent,
    ProductsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule
  ],
  exports: [
    ProductSaveComponent,
    ProductCardComponent,
    ProductsComponent
  ]
})
export class MyPizzaGesShComponentsModule { }
