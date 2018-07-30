import { Component, OnInit } from '@angular/core';
import {CouponService} from '../../../shared/_services/coupon.service';
import {Coupon} from '../../../shared/_models/Coupon';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DateFromValidation} from '../coupon-create/validator/DateFromValidation.directive';
import {isValidDate} from 'ngx-bootstrap/timepicker/timepicker.utils';
import {first} from 'rxjs/internal/operators';

@Component({
  selector: 'app-edit-coupon',
  templateUrl: './edit-coupon.component.html',
  styleUrls: ['./edit-coupon.component.scss']
})
export class EditCouponComponent implements OnInit {

  couponForm: FormGroup;
  myDate: Date;
  coupon: Coupon;
  couponPass: Coupon = null;
  dateFrom: Date;
  dateUntil: Date;
  submitted = false;
  constructor(private router: Router, public formBuilder: FormBuilder, public couponService: CouponService) { }

  ngOnInit() {
    this.couponService.currentMessage.subscribe(coupon => this.couponPass = coupon);

    this.myDate = new Date(this.couponPass.valid_from );
    const from = this.myDate.toISOString().substring(0, 23);
    this.myDate = new Date(this.couponPass.valid_until );
    let until = this.myDate.toISOString().substring(0, 23);
    if (until === '1970-01-01T00:00:00.000') {
      until = '';
    }
    this.couponForm = this.formBuilder.group({
      title: [this.couponPass.title, Validators.compose([Validators.maxLength(40), Validators.required])],
      description: [this.couponPass.description],
      price: [this.couponPass.price, Validators.compose([Validators.required])],
      valid_from: [from, Validators.compose([Validators.required])],
      valid_until: [until],
      state: ['1'],
      constraints: [this.couponPass.constraints],
      owner: ['2', Validators.compose([Validators.required])], // da settare l'owner che è quello che genera il coupon
      consumer: ['2', Validators.compose([Validators.required])] //
    }, {
      validator: Validators.compose([DateFromValidation.CheckDateDay])
    });
  }
  get f() { return this.couponForm.controls; }

  saveChange() {
    this.dateFrom = new Date(this.couponForm.value.valid_from);
    this.dateUntil = new Date( this.couponForm.value.valid_until);

    if (!isValidDate(this.dateUntil)) {
      this.dateUntil = new Date(0);
      }
    this.submitted = true;
    if (this.couponForm.invalid) {
      console.log('coupon invalid');
      return;

    }
    this.coupon = new Coupon( this.couponForm.value.title,
      this.couponForm.value.description,
      this.couponForm.value.timestamp, this.couponForm.value.price, this.dateFrom.getTime().valueOf(),
      this.dateUntil.getTime().valueOf(),
      this.couponForm.value.state, this.couponForm.value.constraints,
      this.couponForm.value.owner, this.couponForm.value.consumer);

    this.couponService.editCoupon(this.coupon).pipe(first())
      .subscribe(
        data => {
          // this.setSignedUp(this.registrationForm.value.username);
          this.router.navigate(['/reserved-area/list']);
        }, error => {
          // this.loading = false;
          console.log(error);
        }
      );
  }

}
