import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {Coupon} from '../../../../../shared/_models/Coupon';
import {BreadcrumbActions} from '../../../../../core/breadcrumb/breadcrumb.actions';
import {CouponService} from '../../../../../shared/_services/coupon.service';
import {Router} from '@angular/router';
import {Breadcrumb} from '../../../../../core/breadcrumb/Breadcrumb';
import {UserService} from '../../../../../shared/_services/user.service';
import {GlobalEventsManagerService} from '../../../../../shared/_services/global-event-manager.service';

@Component({
  selector: 'app-coupon-bought-detail',
  templateUrl: './coupon-bought-detail.component.html',
  styleUrls: ['./coupon-bought-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CouponBoughtDetailComponent implements OnInit, OnDestroy { // TODO delete (redundant)
  imageURL = environment.protocol + '://' + environment.host + ':' + environment.port + '/';
  couponPass: Coupon;
  cart = new Coupon();
  producer = null;
  desktopMode: boolean;

  constructor(
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService,
    private router: Router,
    private userService: UserService,
    private globalEventService: GlobalEventsManagerService,
  ) {
  }

  ngOnInit() {
    this.couponService.currentMessage.subscribe(coupon => {
      if (coupon === null) {
        this.router.navigate(['/reserved-area/consumer/bought']);
      } else {
        this.couponPass = coupon;
        this.addBreadcrumb();
        this.getOwner();
      }
      this.globalEventService.desktopMode.subscribe(message => {
        this.desktopMode = message;
      });
    });
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/reserved-area/consumer/'));
    bread.push(new Breadcrumb('My Purchases', '/reserved-area/consumer/bought/'));
    bread.push(new Breadcrumb(this.couponPass.title + ' details', '/reserved-area/consumer/bought/details'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  formatPrice(price) {
    return price === 0 ? 'Free' : '€ ' + price.toFixed(2);
  }

  formatUntil(until) {
    return until ? this.formatDate(until) : 'Unlimited';
  }


  formatDate(inptuDate) {
    const date = inptuDate.toString().substring(0, inptuDate.indexOf('T'));
    const time = inptuDate.toString().substring(inptuDate.indexOf('T') + 1, inptuDate.indexOf('Z'));
    return 'Date: ' + date + ' Time: ' + time;
  }

  retry() {
    this.router.navigate(['/reserved-area/consumer/bought']);
  }

  getOwner() {
    this.userService.getProducerFromId(this.couponPass.owner).subscribe(user => {
      this.producer = user;
      this.couponService.setUserCoupon(this.producer);
    });
  }

}
