import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManagerNavComponent } from './product-manager-nav.component';

describe('ProductManagerNavComponent', () => {
  let component: ProductManagerNavComponent;
  let fixture: ComponentFixture<ProductManagerNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductManagerNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductManagerNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
