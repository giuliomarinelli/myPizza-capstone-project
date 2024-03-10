import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistratiComponent } from './registrati.component';

const routes: Routes = [{ path: '', component: RegistratiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistratiRoutingModule { }
