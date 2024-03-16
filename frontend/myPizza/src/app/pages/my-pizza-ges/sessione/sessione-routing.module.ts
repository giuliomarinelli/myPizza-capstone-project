import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessioneComponent } from './sessione.component';

const routes: Routes = [{ path: '', component: SessioneComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessioneRoutingModule { }
