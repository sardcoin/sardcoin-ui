import {Component, OnInit} from '@angular/core';
import {Coupon} from '../../../shared/_models/Coupon';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CouponService} from '../../../shared/_services/coupon.service';
import {first} from 'rxjs/internal/operators';
import {Router} from '@angular/router';
import {Time} from '@angular/common';
import {Timeouts} from 'selenium-webdriver';

@Component({
  selector: 'app-feature-reserved-area-coupon-create',
  templateUrl: './coupon-create.component.html',
  styleUrls: ['./coupon-create.component.scss']
})

export class FeatureReservedAreaCouponCreateComponent implements OnInit {
  couponForm: FormGroup;
  coupon: Coupon;
  couponPass: Coupon = null;
  hoursPassed = false;
  toDayDate: Date;
  dateFrom: Date;
  dateUntil: Date;
  toDay: string;
  tomorrow: string;
  tomorrowDate: Date;
  submitted = false;
  couponArray: Coupon[] = [];
  error = {'error_valid_from': 0 , 'error_valid_until': 1, 'error_from_until': 2 };
  constructor(private router: Router, public formBuilder: FormBuilder, public couponService: CouponService) {
    this.coupon = new Coupon('ciao', '',
      '', 1, '', '', 1, '', 1, 1);
    console.log('ciao');
  }

  ngOnInit(): void {
    this.couponService.currentMessage.subscribe(coupon => this.couponPass = coupon);
    this.toDayDate = new Date();
    this.tomorrowDate = new Date();
    this.toDay = new Date().toLocaleDateString('fr-CA');
    this.tomorrowDate = new Date( this.tomorrowDate.setDate(this.toDayDate.getDate() + 1));
    this.tomorrow = this.tomorrowDate.toLocaleDateString('fr-CA');
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

    console.log( ' this.couponForm.value.valid_from' + this.couponForm.value.valid_from );
    console.log( this.couponForm.value.valid_until);

    console.log( this.couponForm);
    if (this.couponForm.value.valid_from > this.couponForm.value.valid_until) {

       this.showError(this.error.error_from_until);
    }
  }

  get f() { return this.couponForm.controls; }

  saveCoupon() {
    this.dateFrom = new Date(this.couponForm.value.valid_from);
    const hours_from = this.couponForm.value.valid_from_time.substring(0, 2);
    const minutes_from = this.couponForm.value.valid_from_time.substring(3, 5);
    this.dateFrom.setHours(hours_from);
    this.dateFrom.setMinutes(minutes_from);
    console.log('ora inserita:' + hours_from);
    console.log('ora numero: ' + this.toDayDate.getTime().toFixed());
    console.log('ora string: ' + this.toDayDate.toLocaleString());

    console.log('ora inserita: ' + this.dateFrom.getTime().toFixed());
    console.log('ora inserita string: ' + this.dateFrom.toLocaleString());
    this.dateUntil = new Date( this.couponForm.value.valid_until);

    const hours_until = this.couponForm.value.valid_until_time.substring(0, 2);
    const minutes_until = this.couponForm.value.valid_until_time.substring(3, 5);
    this.dateUntil.setHours(hours_from);
    this.dateUntil.setMinutes(minutes_from);
    this.submitted = true;

    // stop here if form is invalid
    if (this.couponForm.invalid) {
      console.log('coupon invalid');
      return;

    }

    if (this.toDayDate.getTime().valueOf() > this.dateFrom.getTime().valueOf()) {

    console.log('ora passata');
    this.hoursPassed = true;
    alert('ora passata!');
    return;
    }

    if (this.dateUntil.getTime().valueOf() < this.dateFrom.getTime().valueOf()) {

      console.log('valid_from > valid_until');
      alert('Il giorno di scadenza è prima del giorno di attivazione!');
      return;
    }

      this.couponService.addCoupon( this.couponForm.value.title,
      this.couponForm.value.description,
      this.couponForm.value.timestamp, this.couponForm.value.price, this.dateFrom.getTime().valueOf(),
        this.dateUntil.getTime().valueOf(),
      this.couponForm.value.state, this.couponForm.value.constraints,
      this.couponForm.value.owner, this.couponForm.value.consumer);

      this.couponService.register().pipe(first())
        .subscribe(
          data => {
            // this.setSignedUp(this.registrationForm.value.username);
            this.router.navigate(['/reserved-area/list']);
          }, error => {
            // this.loading = false;
            console.log(error);
          }
        );

      console.log( this.couponService.getAllCoupons() );

    console.log( this.couponForm.value.valid_from);
    console.log( this.couponForm.value.valid_until);
    const f = Date.parse(this.couponForm.value.valid_from);
    const tf = 0;

    const u = Date.parse(this.couponForm.value.valid_until);
    const f_n = Math.round(f);
    const f_u = Math.round(u);

    console.log( typeof f_n);
    console.log( this.couponForm.value.valid_from +
      'T' + this.couponForm.value.valid_from_time);
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


