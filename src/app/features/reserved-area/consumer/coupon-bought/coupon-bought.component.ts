import {Component, OnDestroy, OnInit} from '@angular/core';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {environment} from '../../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {Coupon} from '../../../../shared/_models/Coupon';
import {CouponToken} from '../../../../shared/_models/CouponToken';
import {GlobalEventsManagerService} from '../../../../shared/_services/global-event-manager.service';

@Component({
  selector: 'app-feature-reserved-area-consumer-bought',
  templateUrl: './coupon-bought.component.html',
  styleUrls: ['./coupon-bought.component.scss']
})

export class FeatureReservedAreaConsumerBoughtComponent implements OnInit, OnDestroy {

  coupons: any;
  isDesktop: boolean;

  constructor(
    private globalEventService: GlobalEventsManagerService,
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService,
    private _sanitizer: DomSanitizer,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.globalEventService.desktopMode.subscribe(message => this.isDesktop = message);
    this.addBreadcrumb();
    this.loadCoupons();
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('I miei acquisti', '/bought'));

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
    return this._sanitizer.bypassSecurityTrustUrl(environment.protocol + '://' + environment.host + ':' + environment.port + '/' + path);
  }

  formatPrice(price) {
    if (price === 0) {
      return 'Gratis';
    }
    return '€ ' + price.toFixed(2);
  }

  formatState(state) {
    if (state !== null) {
      return 'Consumato';
    } else {
      return 'Riscattabile';
    }
  }

  details(coupon: Coupon, token: CouponToken) {

    const cp = coupon;
    cp.quantity = 0;
    cp.token = token;

    this.couponService.setCoupon(coupon);

    this.router.navigate(['/bought/details']);
  }
}
