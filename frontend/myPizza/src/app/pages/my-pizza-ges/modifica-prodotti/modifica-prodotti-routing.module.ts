import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModificaProdottiComponent } from './modifica-prodotti.component';

const routes: Routes = [{ path: '', component: ModificaProdottiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModificaProdottiRoutingModule { }
