import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientiComponent } from './ingredienti.component';

describe('IngredientiComponent', () => {
  let component: IngredientiComponent;
  let fixture: ComponentFixture<IngredientiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IngredientiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IngredientiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
