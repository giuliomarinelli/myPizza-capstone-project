import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IlNostroMenuComponent } from './il-nostro-menu.component';

const routes: Routes = [{ path: '', component: IlNostroMenuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IlNostroMenuRoutingModule { }
