import {Component, OnDestroy, OnInit} from '@angular/core';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {Router} from '@angular/router';

@Component({
  selector: 'app-producer-info-coupon',
  templateUrl: './producer-info-coupon.component.html',
  styleUrls: ['./producer-info-coupon.component.scss']
})
export class ProducerInfoCouponComponent implements OnInit, OnDestroy  {
  producerCoupon: any;
  couponPass: any;

  constructor(
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.couponService.currentUserCoupon.subscribe(user => {
      this.producerCoupon = user;
      // console.log('this.producerCoupon', this.producerCoupon);
      this.couponService.currentMessage.subscribe(coupon => {
        this.couponPass = coupon;
        // console.log('this.producerCoupon', this.couponPass);
        this.addBreadcrumb();
      });
    });


  }
  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }
  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }
  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Consumer', '/reserved-area/consumer/'));
    if ( this.couponPass !== null) { bread.push(new Breadcrumb(this.couponPass.title, '/reserved-area/consumer/showcase')); }
    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  retry() {

    this.router.navigate(['/reserved-area/consumer/showcase']);
  }

}
