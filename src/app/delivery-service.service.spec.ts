import { TestBed } from '@angular/core/testing';

import { DeliveryServiceService } from './delivery-service.service';

describe('DeliveryServiceService', () => {
  let service: DeliveryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
