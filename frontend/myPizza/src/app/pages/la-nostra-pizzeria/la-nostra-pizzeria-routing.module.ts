import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaNostraPizzeriaComponent } from './la-nostra-pizzeria.component';

const routes: Routes = [{ path: '', component: LaNostraPizzeriaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaNostraPizzeriaRoutingModule { }
