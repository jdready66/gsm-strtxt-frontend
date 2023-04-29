import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyCustomerComponent } from './notify-customer.component';

describe('NotifyCustomerComponent', () => {
  let component: NotifyCustomerComponent;
  let fixture: ComponentFixture<NotifyCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifyCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifyCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
