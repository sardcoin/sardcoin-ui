import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../../../environments/environment.prod';
import {BreadcrumbActions} from "../../../../core/breadcrumb/breadcrumb.actions";
import {Breadcrumb} from "../../../../core/breadcrumb/Breadcrumb";
import {Coupon} from "../../../../shared/_models/Coupon";
import {CouponService} from "../../../../shared/_services/coupon.service";
import {DomSanitizer} from "@angular/platform-browser";
// import Any = jasmine.Any;

@Component({
  selector: 'app-feature-reserved-area-consumer-showcase',
  templateUrl: './coupon-showcase.component.html',
  styleUrls: ['./coupon-showcase.component.scss']
})
export class FeatureReservedAreaConsumerShowcaseComponent implements OnInit, OnDestroy {

  coupons: any;

  constructor(
    private couponService: CouponService,
    private breadcrumbActions: BreadcrumbActions,
    private _sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.loadCoupons();
    this.addBreadcrumb();
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Consumer', '/reserved-area/consumer/'));
    bread.push(new Breadcrumb('Showcase', '/reserved-area/consumer/showcase'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  loadCoupons() {
    this.couponService.getAffordables()
      .subscribe(coupons => {
        this.coupons = coupons;
      }, err => {
        console.log(err);
      });
  }

  imageUrl(path) {
    // let subs = path.substr(path.lastIndexOf('\\')+1);
    return this._sanitizer.bypassSecurityTrustUrl('http://' + environment.host + ':' + environment.port + '/' + path);
  }

  formatPrice(price) {
    if (price === 0) {
      return 'Free';
    }

    return '€ ' + price;
  }
}
