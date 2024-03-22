import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguraNuovaSessioneComponent } from './configura-nuova-sessione.component';

describe('ConfiguraNuovaSessioneComponent', () => {
  let component: ConfiguraNuovaSessioneComponent;
  let fixture: ComponentFixture<ConfiguraNuovaSessioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfiguraNuovaSessioneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfiguraNuovaSessioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
