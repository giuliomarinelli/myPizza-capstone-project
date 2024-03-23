import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCComponent } from './message-c.component';

describe('MessageCComponent', () => {
  let component: MessageCComponent;
  let fixture: ComponentFixture<MessageCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageCComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
