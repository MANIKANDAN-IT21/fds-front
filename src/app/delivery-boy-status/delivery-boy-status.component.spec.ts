import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryBoyStatusComponent } from './delivery-boy-status.component';

describe('DeliveryBoyStatusComponent', () => {
  let component: DeliveryBoyStatusComponent;
  let fixture: ComponentFixture<DeliveryBoyStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryBoyStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryBoyStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
