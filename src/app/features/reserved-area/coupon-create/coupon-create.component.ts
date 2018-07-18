import {Component, OnInit} from '@angular/core';
import {Coupon} from '../../../../model/coupon';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-feature-reserved-area-coupon-create',
  templateUrl: './coupon-create.component.html',
  styleUrls: ['./coupon-create.component.scss']
})

export class FeatureReservedAreaCouponCreateComponent implements OnInit {
  couponForm: FormGroup;
  coupon: Coupon;
  couponArray: Coupon[];
  constructor(private formBuilder: FormBuilder) {
    this.coupon = new Coupon(1, 'ciao', '',
      '', 1, '', '', 1, '', 1, 1);
  }

  ngOnInit(): void {
    this.couponForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.maxLength(40), Validators.required])],
      description: ['', Validators.compose([Validators.maxLength(200), Validators.required])],
      timestamp: ['', Validators.compose([Validators.required])],
      price: ['', Validators.required],
      valid_from: ['', Validators.compose([Validators.required])],
      valid_until: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      constraints: ['', Validators.compose([Validators.required])],
      owner: ['', Validators.compose([Validators.required])],
      consumer: ['', Validators.compose([Validators.required])],
    });
  }
  saveCoupon() {

    this.coupon = new Coupon(this.couponForm.value.id, this.couponForm.value.title,
      this.couponForm.value.description,
      this.couponForm.value.timestamp, this.couponForm.value.price, this.couponForm.value.valid_from ,
      this.couponForm.value.valid_until, this.couponForm.value.state, this.couponForm.value.constraints,
      this.couponForm.value.owner, this.couponForm.value.consumer);
      this.couponArray.push(this.coupon);
  }
}


