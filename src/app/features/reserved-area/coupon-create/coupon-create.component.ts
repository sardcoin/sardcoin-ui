import {Component, OnInit} from '@angular/core';
import {Coupon} from '../../../shared/_models/Coupon';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CouponService} from '../../../shared/_services/coupon.service';

@Component({
  selector: 'app-feature-reserved-area-coupon-create',
  templateUrl: './coupon-create.component.html',
  styleUrls: ['./coupon-create.component.scss']
})

export class FeatureReservedAreaCouponCreateComponent implements OnInit {
  couponForm: FormGroup;
  coupon: Coupon;
  toDayDate: Date;
  toDay: string;
  tomorrowDate: Date;
  tomorrow: string;
  submitted = false;
  couponArray: Coupon[] = [];
  error = {'error_valid_from': 0 , 'error_valid_until': 1, 'error_from_until': 2 };
  constructor(public formBuilder: FormBuilder, public couponService: CouponService) {
    this.coupon = new Coupon('ciao', '',
      '', 1, '', '', 1, '', 1, 1);
    console.log('ciao');
  }

  ngOnInit(): void {
    this.toDayDate = new Date();
    this.toDay = new Date().toLocaleDateString('fr-CA');
    this.tomorrowDate = new Date( this.toDayDate.setDate(this.toDayDate.getDate() + 1));
    this.tomorrow = this.tomorrowDate.toLocaleDateString('fr-CA');
    console.log('ora: ' + this.toDayDate.getTime().toFixed());
    this.couponForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.maxLength(40), Validators.required])],
      description: [''],
      // timestamp: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
      valid_from: ['', Validators.compose([Validators.required])],
      valid_from_time: ['', Validators.compose([Validators.required])],
      valid_until: [''],
      valid_until_time: [''],
      state: [''],
      constraints: [''],
      owner: ['', Validators.compose([Validators.required])],
      consumer: ['', Validators.compose([Validators.required])],
    });

    console.log( this.couponForm.value.valid_from );
    console.log( this.couponForm.value.valid_until);

    console.log( this.couponForm);
    if (this.couponForm.value.valid_from > this.couponForm.value.valid_until) {

       this.showError(this.error.error_from_until);
    }
  }

  get f() { return this.couponForm.controls; }

  saveCoupon() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.couponForm.invalid) {
      console.log('coupon invalid');
      return;

    }

    alert('SUCCESS!! :-)');

      this.couponService.addCoupon( this.couponForm.value.title,
      this.couponForm.value.description,
      this.couponForm.value.timestamp, this.couponForm.value.price, this.couponForm.value.valid_from +
      +'T' + this.couponForm.value.valid_from_time,
      this.couponForm.value.valid_until + 'T' + this.couponForm.value.valid_until_time,
      this.couponForm.value.state, this.couponForm.value.constraints,
      this.couponForm.value.owner, this.couponForm.value.consumer);

      this.couponService.register();

      console.log( this.couponService.getAllCoupons() );

    console.log( this.couponForm.value.valid_from);
    console.log( this.couponForm.value.valid_until);
    const f = Date.parse(this.couponForm.value.valid_from);
    const u = Date.parse(this.couponForm.value.valid_until);
    const f_n = Math.round(f);
    const f_u = Math.round(u);

    console.log( f_n);
    console.log( f_u);
    if (f_n > f_u) {

      this.showError(this.error.error_from_until);
    }
  }

  showError(err) {
    if (err === 0) {
      {
        console.log('error 0');
      }
    } else if (err === 1) {
      console.log('error 1');
    } else {
      console.log('error 2');
    }
  }
}


