import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiProdottiDialogComponent } from './aggiungi-prodotti-dialog.component';

describe('AggiungiProdottiDialogComponent', () => {
  let component: AggiungiProdottiDialogComponent;
  let fixture: ComponentFixture<AggiungiProdottiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AggiungiProdottiDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AggiungiProdottiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
