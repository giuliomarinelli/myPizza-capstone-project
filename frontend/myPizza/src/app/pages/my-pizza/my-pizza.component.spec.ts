import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPizzaComponent } from './my-pizza.component';

describe('MyPizzaComponent', () => {
  let component: MyPizzaComponent;
  let fixture: ComponentFixture<MyPizzaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyPizzaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyPizzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
