import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { Breadcrumb } from '../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { Coupon } from '../../../../shared/_models/Coupon';
import { CouponService } from '../../../../shared/_services/coupon.service';
import { GlobalEventsManagerService } from '../../../../shared/_services/global-event-manager.service';
import { ITEM_TYPE } from '../../../../shared/_models/CartItem';

@Component({
  selector: 'app-feature-reserved-area-consumer-bought',
  templateUrl: './coupon-bought.component.html',
  styleUrls: ['./coupon-bought.component.scss']
})

export class FeatureReservedAreaConsumerBoughtComponent implements OnInit, OnDestroy {

  coupons: Array<Coupon> = [];
  isDesktop: boolean;
  ITEM_TYPE = ITEM_TYPE;

  constructor(
    private globalEventService: GlobalEventsManagerService,
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService,
    private _sanitizer: DomSanitizer,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.globalEventService.desktopMode.subscribe(message => this.isDesktop = message);
    this.addBreadcrumb();
    this.loadCoupons();
  }

  ngOnDestroy = (): void => {
    this.removeBreadcrumb();
  };

  addBreadcrumb = (): void => {
    const bread: Array<Breadcrumb> = [];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('I miei acquisti', '/bought'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  };

  removeBreadcrumb = (): void => {
    this.breadcrumbActions.deleteBreadcrumb();
  };

  loadCoupons = (): void => {
    this.couponService.getPurchasedCoupons()
      .subscribe(coupons => {
        this.coupons = coupons
          .sort((a: Coupon, b: Coupon) => (new Date(b.purchase_time).getTime()) - (new Date(a.purchase_time).getTime()));
        // this.coupons.forEach(el => el.state = this.formatState(el));
      }, err => {
        // tslint:disable-next-line:no-console
        console.log(err);
      });
  };

  imageUrl = (path): SafeUrl =>
    this._sanitizer.bypassSecurityTrustUrl(`${environment.protocol}://${environment.host}:${environment.port}/${path}`);

  formatPrice = (price): string =>
    price === 0 ? 'Gratis' : `€ ${price.toFixed(2)}`;

  formatState = (coupon: Coupon): string => {
    let state;
    let validUntil;

    if (coupon) {
      validUntil = coupon.valid_until ? (new Date(coupon.valid_until).getTime()) : undefined;
      state = coupon.token.verifier ? 'Consumato' : ((validUntil && Date.now() > validUntil) ? 'Scaduto' : 'Disponibile');
    }

    return state;
  };

  formatDate = (inputDate): string => {
    const auxDate = inputDate.slice(0, 10)
      .split('-');
    const date = `${auxDate[2]}/${auxDate[1]}/${auxDate[0]}`;
    const time = inputDate.toString()
      .substring(inputDate.indexOf('T') + 1, inputDate.indexOf('.000'));

    return `${date} ${time}`;
  };

  getStateColor = (state: string): string => { // === 'Disponibile' ? '#28a745' : '#dc3545'
    let color;

    switch (state) {
      case 'Scaduto':
        color = '#dc3545';
        break;
      case 'Consumato':
        color = '#ffc107';
        break;
      default:
        color = '#28a745';
    }

    return color;
  };

  details = (coupon: Coupon): void => {
    this.couponService.setCoupon(coupon);
    this.router.navigate(['/bought/details']);
  };
}
