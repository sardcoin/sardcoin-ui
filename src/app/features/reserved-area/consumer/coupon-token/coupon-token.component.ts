import {Component, OnDestroy, OnInit} from '@angular/core';
import {DateFromValidation} from '../../producer/coupon-create/validator/DateFromValidation.directive';
import {ImageValidation} from '../../producer/coupon-create/validator/ImageValidation.directive.';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {QuantityCouponValidation} from '../../producer/coupon-create/validator/QuantityCouponValidation.directive';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {StoreService} from '../../../../shared/_services/store.service';
import {Router} from '@angular/router';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {ToastrService} from 'ngx-toastr';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';

@Component({
  selector: 'app-coupon-token',
  templateUrl: './coupon-token.component.html',
  styleUrls: ['./coupon-token.component.scss']
})
export class CouponTokenComponent implements OnInit, OnDestroy {
  tokenForm: FormGroup;
  submitted = false;
  coupon: any;

  constructor(
    public formBuilder: FormBuilder,
    public couponService: CouponService,
    public storeService: StoreService,
    private router: Router,
    private breadcrumbActions: BreadcrumbActions,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.tokenForm = this.formBuilder.group({
      token: [null, Validators.required]
    });

    this.addBreadcrumb();

  }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }
  get f() {
    return this.tokenForm.controls;
  }
  redeems() {
    this.submitted = true;
 this.couponService.getAffordables().subscribe(coupons => {
   const cp = JSON.parse(JSON.stringify(coupons));
   for ( const i of cp) {
     if (i.state === 3 && i.token === this.tokenForm.value.token) {
       this.coupon = {
         token: this.tokenForm.value.token,
         consumer: this.storeService.getId(),
       };
       console.log('coupon', this.coupon);
       this.couponService.validate(this.coupon).subscribe(
         (data) => {
           this.toastValidate();
           this.router.navigate(['/reserved-area/consumer/bought']);
         }, error => {
           console.log(error);
         }
       );
     }
   }
 });
  }
  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Consumer', '/reserved-area/consumer/'));
    bread.push(new Breadcrumb('Validate Coupons', '/reserved-area/consumer/coupon-token/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  toastValidate() {
    this.toastr.success( 'Coupon validated successfully');
  }


}
