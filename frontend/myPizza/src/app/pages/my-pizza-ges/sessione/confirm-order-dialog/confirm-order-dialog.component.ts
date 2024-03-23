import { ApplicationRef, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from '../../../../Models/i-order';
import { appSymbol } from '@igniteui/material-icons-extended';


@Component({
  selector: 'app-confirm-order-dialog',
  templateUrl: './confirm-order-dialog.component.html',
  styleUrl: './confirm-order-dialog.component.scss'
})
export class ConfirmOrderDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {order: Order}, private appRef: ApplicationRef, private cdRef: ChangeDetectorRef) {

  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
}


}
