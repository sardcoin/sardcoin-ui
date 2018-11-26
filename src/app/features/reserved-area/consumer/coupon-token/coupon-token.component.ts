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
import {validate} from 'codelyzer/walkerFactory/walkerFn';

@Component({
  selector: 'app-coupon-token',
  templateUrl: './coupon-token.component.html',
  styleUrls: ['./coupon-token.component.scss']
})
export class CouponTokenComponent implements OnInit, OnDestroy {
  tokenForm: FormGroup;
  submitted = false;
  data: any;

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
  import() {
    this.submitted = true;




       this.data = {
         token: this.tokenForm.value.token,
       };

       this.couponService.importOfflineCoupon(this.data).subscribe(
         (data) => {
           console.log('data', data);
           if (data !== null) {
             this.toastValidate();
             this.router.navigate(['/reserved-area/consumer/bought']);
             return;
           } else {
             this.toastError();
             return;
           }
         }, error => {
           this.toastError();

           console.log(error);
           return
         }
       );



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

  toastError() {
    this.toastr.error( 'Coupon invalid!');
  }


}
