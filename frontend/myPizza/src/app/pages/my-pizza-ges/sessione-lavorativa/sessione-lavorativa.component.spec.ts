import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessioneLavorativaComponent } from './sessione-lavorativa.component';

describe('SessioneLavorativaComponent', () => {
  let component: SessioneLavorativaComponent;
  let fixture: ComponentFixture<SessioneLavorativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessioneLavorativaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessioneLavorativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
