import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaNostraPizzeriaComponent } from './la-nostra-pizzeria.component';

describe('LaNostraPizzeriaComponent', () => {
  let component: LaNostraPizzeriaComponent;
  let fixture: ComponentFixture<LaNostraPizzeriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaNostraPizzeriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaNostraPizzeriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
