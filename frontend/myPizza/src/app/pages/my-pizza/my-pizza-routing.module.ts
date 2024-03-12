import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyPizzaComponent } from './my-pizza.component';

const routes: Routes = [{ path: '', component: MyPizzaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyPizzaRoutingModule { }
