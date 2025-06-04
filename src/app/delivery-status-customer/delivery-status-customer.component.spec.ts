import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryStatusCustomerComponent } from './delivery-status-customer.component';

describe('DeliveryStatusCustomerComponent', () => {
  let component: DeliveryStatusCustomerComponent;
  let fixture: ComponentFixture<DeliveryStatusCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryStatusCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryStatusCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
