import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToppingSaveComponent } from './topping-save.component';

describe('ToppingSaveComponent', () => {
  let component: ToppingSaveComponent;
  let fixture: ComponentFixture<ToppingSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToppingSaveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToppingSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
