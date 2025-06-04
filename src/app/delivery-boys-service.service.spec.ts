import { TestBed } from '@angular/core/testing';

import { DeliveryBoysServiceService } from './delivery-boys-service.service';

describe('DeliveryBoysServiceService', () => {
  let service: DeliveryBoysServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryBoysServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
