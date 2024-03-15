import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToppingCardComponent } from './topping-card.component';

describe('ToppingCardComponent', () => {
  let component: ToppingCardComponent;
  let fixture: ComponentFixture<ToppingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToppingCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToppingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
