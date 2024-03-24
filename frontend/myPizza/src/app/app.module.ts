import { MyPizzaGesShComponentsModule } from './my-pizza-ges-sh-components/my-pizza-ges-sh-components.module';
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { HomeModule } from './pages/home/home.module';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { RouteConfigComponent } from './route-config/route-config.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



//I keep the new line

//I keep the new line
@NgModule({
  declarations: [
    AppComponent,
    RouteConfigComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    HomeModule,
    HttpClientModule,
    MyPizzaGesShComponentsModule,
    BrowserAnimationsModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
