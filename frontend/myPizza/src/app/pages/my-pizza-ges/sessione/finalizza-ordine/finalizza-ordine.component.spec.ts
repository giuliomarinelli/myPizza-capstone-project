import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizzaOrdineComponent } from './finalizza-ordine.component';

describe('FinalizzaOrdineComponent', () => {
  let component: FinalizzaOrdineComponent;
  let fixture: ComponentFixture<FinalizzaOrdineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinalizzaOrdineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalizzaOrdineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
