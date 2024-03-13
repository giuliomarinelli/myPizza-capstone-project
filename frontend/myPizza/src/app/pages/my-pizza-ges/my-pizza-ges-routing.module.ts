import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyPizzaGesComponent } from './my-pizza-ges.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MyPizzaGesComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyPizzaGesRoutingModule { }
