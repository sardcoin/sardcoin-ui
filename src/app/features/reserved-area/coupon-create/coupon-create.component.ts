import {Component, OnDestroy, OnInit} from '@angular/core';
import {Coupon} from '../../../shared/_models/Coupon';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CouponService} from '../../../shared/_services/coupon.service';
import {first} from 'rxjs/internal/operators';
import {Router} from '@angular/router';
import {DateFromValidation} from './validator/DateFromValidation.directive';
import {isValidDate} from 'ngx-bootstrap/timepicker/timepicker.utils';
import {StoreService} from "../../../shared/_services/store.service";
import {Breadcrumb} from "../../../core/breadcrumb/Breadcrumb";
import {BreadcrumbActions} from "../../../core/breadcrumb/breadcrumb.actions";

@Component({
  selector: 'app-feature-reserved-area-coupon-create',
  templateUrl: './coupon-create.component.html',
  styleUrls: ['./coupon-create.component.scss']
})

export class FeatureReservedAreaCouponCreateComponent implements OnInit, OnDestroy {
  couponForm: FormGroup;
  coupon: Coupon;
  couponPass: Coupon = null;
  dateFrom: Date;
  dateUntil: Date;
  submitted = false;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public storeService: StoreService,
    public couponService: CouponService,
    private breadcrumbActions: BreadcrumbActions
  ) { }

  ngOnInit(): void {
    this.couponService.currentMessage.subscribe(coupon => this.couponPass = coupon);

    this.couponForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(40), Validators.required])],
      description: [],
      price: ['', Validators.compose([Validators.required])],
      valid_from: ['', Validators.compose([Validators.required])],
      valid_until: [''],
      state: ['0'],
      constraints: [],
      owner: [this.storeService.getId()],
      consumer: []
    }, {
      validator: Validators.compose([DateFromValidation.CheckDateDay])
    });

    this.addBreadcrumb()

  }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }

  get f() {
    return this.couponForm.controls;
  }

  saveCoupon() {
    this.dateFrom = new Date(this.couponForm.value.valid_from);
    this.dateUntil = new Date(this.couponForm.value.valid_until);

    if (!isValidDate(this.dateUntil)) {
      this.dateUntil = new Date(0);

    }
    this.submitted = true;

    // stop here if form is invalid
    if (this.couponForm.invalid) {
      console.log('coupon invalid');
      return;

    }
    this.coupon = new Coupon(
      this.couponForm.value.title,
      this.couponForm.value.description,
      this.couponForm.value.timestamp,
      this.couponForm.value.price,
      this.dateFrom.getTime().valueOf(),
      this.dateUntil.getTime().valueOf(),
      this.couponForm.value.state,
      this.couponForm.value.constraints,
      this.couponForm.value.owner,
      this.couponForm.value.consumer
    );

    this.couponService.register(this.coupon).pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/reserved-area/list']);
        }, error => {
          console.log(error);
        }
      );
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Create Coupon', '/reserved-area/create/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }
}


