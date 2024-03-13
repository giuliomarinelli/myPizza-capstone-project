import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSaveComponent } from './product-save/product-save.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    ProductSaveComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule
  ],
  exports: [ProductSaveComponent]
})
export class MyPizzaGesShComponentsModule { }
