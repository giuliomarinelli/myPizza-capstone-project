import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinalizzaOrdineComponent } from './finalizza-ordine.component';

const routes: Routes = [{ path: '', component: FinalizzaOrdineComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinalizzaOrdineRoutingModule { }
