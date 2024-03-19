import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessioneLavorativaComponent } from './sessione-lavorativa.component';

const routes: Routes = [{ path: '', component: SessioneLavorativaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessioneLavorativaRoutingModule { }
