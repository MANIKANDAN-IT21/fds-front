import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayOffersComponent } from './today-offers.component';

describe('TodayOffersComponent', () => {
  let component: TodayOffersComponent;
  let fixture: ComponentFixture<TodayOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
