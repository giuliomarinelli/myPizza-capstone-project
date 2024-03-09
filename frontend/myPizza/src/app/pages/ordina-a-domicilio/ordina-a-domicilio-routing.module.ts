import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdinaADomicilioComponent } from './ordina-a-domicilio.component';

const routes: Routes = [{ path: '', component: OrdinaADomicilioComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdinaADomicilioRoutingModule { }
