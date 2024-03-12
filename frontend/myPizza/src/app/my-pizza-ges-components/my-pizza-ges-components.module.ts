import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaveProductComponent } from './save-product/save-product.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SaveProductComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class MyPizzaGesComponentsModule { }
