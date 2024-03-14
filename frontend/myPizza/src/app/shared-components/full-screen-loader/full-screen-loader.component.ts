import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-full-screen-loader',
  templateUrl: './full-screen-loader.component.html',
  styleUrl: './full-screen-loader.component.scss'
})
export class FullScreenLoaderComponent {
  @Input() public isLoading: boolean = true
  protected dNone = false
  ngDoCheck() {

  }

}
