import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPizzaGesComponent } from './my-pizza-ges.component';

describe('MyPizzaGesComponent', () => {
  let component: MyPizzaGesComponent;
  let fixture: ComponentFixture<MyPizzaGesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyPizzaGesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyPizzaGesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
