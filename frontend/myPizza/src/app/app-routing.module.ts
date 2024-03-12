import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login-page/login-page.module').then(m => m.LoginPageModule)
  },
  { path: 'ordina-a-domicilio', loadChildren: () => import('./pages/ordina-a-domicilio/ordina-a-domicilio.module').then(m => m.OrdinaADomicilioModule) },
  { path: 'il-nostro-menu', loadChildren: () => import('./pages/il-nostro-menu/il-nostro-menu.module').then(m => m.IlNostroMenuModule) },
  { path: 'la-nostra-pizzeria', loadChildren: () => import('./pages/la-nostra-pizzeria/la-nostra-pizzeria.module').then(m => m.LaNostraPizzeriaModule) },
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule), pathMatch: 'full' },
  { path: 'registrati', loadChildren: () => import('./pages/registrati/registrati.module').then(m => m.RegistratiModule) },
  { path: 'my-pizza', loadChildren: () => import('./pages/my-pizza/my-pizza.module').then(m => m.MyPizzaModule) },
  { path: 'my-pizza-ges', loadChildren: () => import('./pages/my-pizza-ges/my-pizza-ges.module').then(m => m.MyPizzaGesModule) },
  { path: 'my-pizza-ges/aggiungi-prodotti', loadChildren: () => import('./pages/my-pizza-ges/aggiungi-prodotti/aggiungi-prodotti.module').then(m => m.AggiungiProdottiModule) },
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
