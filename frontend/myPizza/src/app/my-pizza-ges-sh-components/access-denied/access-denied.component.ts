import { Location } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss'
})
export class AccessDeniedComponent {

  constructor(private location: Location) { }

  protected goBack() {
    this.location.back()
  }
}
