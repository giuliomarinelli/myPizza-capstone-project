import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguraNuovaSessioneComponent } from './configura-nuova-sessione.component';

const routes: Routes = [{ path: '', component: ConfiguraNuovaSessioneComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguraNuovaSessioneRoutingModule { }
