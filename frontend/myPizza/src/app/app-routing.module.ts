import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsLoggedInGuard } from './guards/is-logged-in.guard';
import { AlreadyLoggedInGuard } from './guards/already-logged-in.guard';
import { AdminGuard } from './guards/admin.guard';
import { IsLoggedInVariantGuard } from './guards/is-logged-in-variant.guard';

const routes: Routes = [

  {
    path: 'login',
    loadChildren: () => import('./pages/login-page/login-page.module').then(m => m.LoginPageModule),
    canActivate: [AlreadyLoggedInGuard],
    canActivateChild: [AlreadyLoggedInGuard]
  },
  {
    path: 'ordina-a-domicilio',
    loadChildren: () => import('./pages/ordina-a-domicilio/ordina-a-domicilio.module').then(m => m.OrdinaADomicilioModule)
  },
  {
    path: 'il-nostro-menu',
    loadChildren: () => import('./pages/il-nostro-menu/il-nostro-menu.module').then(m => m.IlNostroMenuModule)
  },
  {
    path: 'la-nostra-pizzeria',
    loadChildren: () => import('./pages/la-nostra-pizzeria/la-nostra-pizzeria.module').then(m => m.LaNostraPizzeriaModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
    pathMatch: 'full'
  },
  {
    path: 'registrati',
    loadChildren: () => import('./pages/registrati/registrati.module').then(m => m.RegistratiModule)
  },
  {
    path: 'my-pizza',
    loadChildren: () => import('./pages/my-pizza/my-pizza.module').then(m => m.MyPizzaModule),
    canActivate: [IsLoggedInGuard],
    canActivateChild: [IsLoggedInGuard]
  },
  {
    path: 'my-pizza-ges',
    redirectTo: 'my-pizza-ges/prodotti'
  },
  {
    path: 'my-pizza-ges/aggiungi-prodotti',
    loadChildren: () => import('./pages/my-pizza-ges/aggiungi-prodotti/aggiungi-prodotti.module').then(m => m.AggiungiProdottiModule),
    canActivate: [IsLoggedInGuard],
    canActivateChild: [IsLoggedInGuard]
  },
  {
    path: 'my-pizza-ges/prodotti',
    loadChildren: () => import('./pages/my-pizza-ges/prodotti/prodotti.module').then(m => m.ProdottiModule),
    canActivate: [IsLoggedInGuard, AdminGuard],
    canActivateChild: [IsLoggedInGuard, AdminGuard]
  },
  {
    path: 'my-pizza-ges/ingredienti',
    loadChildren: () => import('./pages/my-pizza-ges/ingredienti/ingredienti.module').then(m => m.IngredientiModule),
    canActivate: [IsLoggedInGuard, AdminGuard],
    canActivateChild: [IsLoggedInGuard, AdminGuard]
  },
  {
    path: 'my-pizza-ges/sessione',
    loadChildren: () => import('./pages/my-pizza-ges/sessione/sessione.module').then(m => m.SessioneModule),
    canActivate: [IsLoggedInVariantGuard, AdminGuard],
    canActivateChild: [IsLoggedInVariantGuard, AdminGuard]
  },
  {
    path: 'my-pizza-ges/gestisci-visualizzazione-menu',
    loadChildren: () => import('./pages/my-pizza-ges/gestisci-visualizzazione-menu/gestisci-visualizzazione-menu.module').then(m => m.GestisciVisualizzazioneMenuModule),
    canActivate: [IsLoggedInGuard, AdminGuard],
    canActivateChild: [IsLoggedInGuard, AdminGuard]
  },
  {
    path: 'ordina-a-domicilio/checkout',
    loadChildren: () => import('./pages/ordina-a-domicilio/checkout/checkout.module').then(m => m.CheckoutModule),
    canActivate: [IsLoggedInVariantGuard],
    canActivateChild: [IsLoggedInVariantGuard]
  },
  {
    path: 'my-pizza-ges/sessione-lavorativa',
    loadChildren: () => import('./pages/my-pizza-ges/sessione-lavorativa/sessione-lavorativa.module').then(m => m.SessioneLavorativaModule),
    canActivate: [IsLoggedInGuard, AdminGuard],
    canActivateChild: [IsLoggedInGuard, AdminGuard]
  },
  {
    path: 'my-pizza-ges/sessione/configura-nuova-sessione',
    loadChildren: () => import('./pages/my-pizza-ges/sessione/configura-nuova-sessione/configura-nuova-sessione.module').then(m => m.ConfiguraNuovaSessioneModule),
    canActivate: [IsLoggedInGuard, AdminGuard],
    canActivateChild: [IsLoggedInGuard, AdminGuard]
  },
  {
    path: 'my-pizza-ges/sessione/finalizza-ordine',
    loadChildren: () => import('./pages/my-pizza-ges/sessione/finalizza-ordine/finalizza-ordine.module').then(m => m.FinalizzaOrdineModule),
    canActivate: [IsLoggedInGuard, AdminGuard],
    canActivateChild: [IsLoggedInGuard, AdminGuard]
  },
  {
    path: 'my-pizza/messaggi',
    loadChildren: () => import('./pages/my-pizza/messaggi/messaggi.module').then(m => m.MessaggiModule),
    canActivate: [IsLoggedInGuard],
    canActivateChild: [IsLoggedInGuard]
  },

  { path: 'loading', loadChildren: () => import('./pages/loading/loading.module').then(m => m.LoadingModule) },


]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
