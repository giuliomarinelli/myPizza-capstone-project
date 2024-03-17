import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestisciVisualizzazioneMenuComponent } from './gestisci-visualizzazione-menu.component';

const routes: Routes = [{ path: '', component: GestisciVisualizzazioneMenuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestisciVisualizzazioneMenuRoutingModule { }
