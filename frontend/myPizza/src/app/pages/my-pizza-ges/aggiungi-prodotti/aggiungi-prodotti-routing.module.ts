import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AggiungiProdottiComponent } from './aggiungi-prodotti.component';

const routes: Routes = [{ path: '', component: AggiungiProdottiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AggiungiProdottiRoutingModule { }
