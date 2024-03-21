import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteConfigComponent } from './route-config.component';

describe('RouteConfigComponent', () => {
  let component: RouteConfigComponent;
  let fixture: ComponentFixture<RouteConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RouteConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RouteConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
