import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullScreenLoaderComponent } from './full-screen-loader/full-screen-loader.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    FullScreenLoaderComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatProgressSpinnerModule
  ],
  exports: [FullScreenLoaderComponent]
})
export class SharedComponentsModule { }
