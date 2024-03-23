import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessaggiComponent } from './messaggi.component';

const routes: Routes = [{ path: '', component: MessaggiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessaggiRoutingModule { }
