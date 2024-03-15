import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngredientiComponent } from './ingredienti.component';

const routes: Routes = [{ path: '', component: IngredientiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngredientiRoutingModule { }
