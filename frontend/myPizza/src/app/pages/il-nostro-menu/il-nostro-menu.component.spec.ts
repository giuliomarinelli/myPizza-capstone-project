import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlNostroMenuComponent } from './il-nostro-menu.component';

describe('IlNostroMenuComponent', () => {
  let component: IlNostroMenuComponent;
  let fixture: ComponentFixture<IlNostroMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IlNostroMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IlNostroMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
