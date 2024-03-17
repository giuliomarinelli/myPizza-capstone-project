import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestisciVisualizzazioneMenuComponent } from './gestisci-visualizzazione-menu.component';

describe('GestisciVisualizzazioneMenuComponent', () => {
  let component: GestisciVisualizzazioneMenuComponent;
  let fixture: ComponentFixture<GestisciVisualizzazioneMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestisciVisualizzazioneMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestisciVisualizzazioneMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
