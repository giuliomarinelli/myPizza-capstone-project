import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiProdottiComponent } from './aggiungi-prodotti.component';

describe('AggiungiProdottiComponent', () => {
  let component: AggiungiProdottiComponent;
  let fixture: ComponentFixture<AggiungiProdottiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AggiungiProdottiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AggiungiProdottiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
