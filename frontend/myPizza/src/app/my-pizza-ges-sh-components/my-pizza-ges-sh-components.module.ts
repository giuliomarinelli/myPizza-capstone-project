import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSaveComponent } from './product-save/product-save.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProductSaveComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [ProductSaveComponent]
})
export class MyPizzaGesShComponentsModule { }
