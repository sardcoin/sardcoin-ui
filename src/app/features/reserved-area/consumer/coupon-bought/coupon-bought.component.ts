import {Component, OnDestroy, OnInit} from '@angular/core';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {environment} from '../../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';

@Component({
  selector: 'app-feature-reserved-area-consumer-bought',
  templateUrl: './coupon-bought.component.html',
  styleUrls: ['./coupon-bought.component.css']
})

export class FeatureReservedAreaConsumerBoughtComponent implements OnInit, OnDestroy {

  coupons: any;
  getAffordables: any;

  constructor(
    private couponService: CouponService,
    private breadcrumbActions: BreadcrumbActions,
    private _sanitizer: DomSanitizer,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.addBreadcrumb();
    this.loadCoupons();
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Consumer', '/reserved-area/consumer/'));
    bread.push(new Breadcrumb('My Purchases', '/reserved-area/consumer/bought'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  loadCoupons() {
    this.couponService.getPurchasedCoupons()
      .subscribe(coupons => {
        this.coupons = coupons;
      }, err => {
        console.log(err);
      });
  }

  imageUrl(path) {
    return this._sanitizer.bypassSecurityTrustUrl('http://' + environment.host + ':' + environment.port + '/' + path);
  }

  formatPrice(price) {
    if (price === 0) {
      return 'Free';
    }

    return '€ ' + price.toFixed(2);
  }

  details(coupon: any) {

    const cp = coupon;
    cp.quantity = 0;
    this.couponService.getAffordables().subscribe(
      data => {
        this.getAffordables = data;
        for (const i of this.getAffordables) {
          if (cp.title === i.title) {
            cp.quantity++;
          }
        }
        this.couponService.setCoupon(coupon);

        this.router.navigate(['/reserved-area/consumer/bought/bought-details']);
      });

  }
}
