import { Component, OnDestroy, OnInit } from '@angular/core';
import { Breadcrumb } from '../../../../core/breadcrumb/Breadcrumb';
import { CouponService } from '../../../../shared/_services/coupon.service';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { environment } from '../../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Coupon } from '../../../../shared/_models/Coupon';
import { GlobalEventsManagerService } from '../../../../shared/_services/global-event-manager.service';
import { SortService } from '../../../../shared/_services/sort.service';

@Component({
  selector: 'app-feature-reserved-area-consumer-bought',
  templateUrl: './coupon-bought.component.html',
  styleUrls: ['./coupon-bought.component.scss']
})

export class FeatureReservedAreaConsumerBoughtComponent implements OnInit, OnDestroy {

  coupons: Coupon[] = [];
  isDesktop: boolean;

  constructor(
    private globalEventService: GlobalEventsManagerService,
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService,
    private sortService: SortService,
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
        this.coupons = this.coupons.sort((a: Coupon, b: Coupon) => (new Date(b.purchase_time).getTime()) - (new Date(a.purchase_time).getTime()));
        this.coupons.forEach(el => el.state = this.formatState(el));
      }, err => {
        console.log(err);
      });
  }

  imageUrl(path) {
    return this._sanitizer.bypassSecurityTrustUrl(environment.protocol + '://' + environment.host + ':' + environment.port + '/' + path);
  }

  formatPrice(price) {
    return price === 0 ? 'Gratis' : '€ ' + price.toFixed(2);
  }

  formatState(coupon: Coupon) {
    let state = null, valid_until = null;

    if(coupon) {
      valid_until = coupon.valid_until ? (new Date(coupon.valid_until).getTime()) : null;
      state = coupon.token.verifier ? 'Consumato' : ((valid_until && Date.now() > valid_until) ? 'Scaduto' : 'Disponibile');
    }

    return state;
  }

  formatDate(inputDate) {
    const auxDate = inputDate.slice(0, 10).split('-');
    const date = auxDate[2] + '/' + auxDate[1] + '/' + auxDate[0];
    const time = inputDate.toString().substring(inputDate.indexOf('T') + 1, inputDate.indexOf('.000'));
    return date + ' ' + time;
  }

  getStateColor(state: string) { // === 'Disponibile' ? '#28a745' : '#dc3545'
    let color = '#28a745';

    switch (state) {
      case 'Scaduto': color = '#dc3545';
        break;
      case 'Consumato': color = '#ffc107';
        break;
    }

    return color;
  }

  onSorted($event) {
    this.coupons = this.sortService.getDataSortedByCriteria(this.coupons, $event);
  }

  details(coupon: Coupon) {
    this.couponService.setCoupon(coupon);
    this.router.navigate(['/bought/details']);
  }
}
