import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdinaADomicilioComponent } from './ordina-a-domicilio.component';

describe('OrdinaADomicilioComponent', () => {
  let component: OrdinaADomicilioComponent;
  let fixture: ComponentFixture<OrdinaADomicilioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdinaADomicilioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdinaADomicilioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
