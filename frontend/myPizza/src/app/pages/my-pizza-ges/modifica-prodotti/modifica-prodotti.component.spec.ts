import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaProdottiComponent } from './modifica-prodotti.component';

describe('ModificaProdottiComponent', () => {
  let component: ModificaProdottiComponent;
  let fixture: ComponentFixture<ModificaProdottiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModificaProdottiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModificaProdottiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
