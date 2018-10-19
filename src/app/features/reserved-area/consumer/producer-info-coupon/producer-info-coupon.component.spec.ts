import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducerInfoCouponComponent } from './producer-info-coupon.component';

describe('ProducerInfoCouponComponent', () => {
  let component: ProducerInfoCouponComponent;
  let fixture: ComponentFixture<ProducerInfoCouponComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducerInfoCouponComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducerInfoCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
