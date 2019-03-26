import {Component} from '@angular/core';
import {GlobalEventsManagerService} from '../../shared/_services/global-event-manager.service';
import {NgRedux, select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {Breadcrumb} from './Breadcrumb';
import {IAppState} from '../../shared/store/model';
import {Router} from '@angular/router';
import {BreadcrumbActions} from './breadcrumb.actions';
import {CartItem} from '../../shared/_models/CartItem';
import {Coupon} from '../../shared/_models/Coupon';
import {CouponService} from '../../shared/_services/coupon.service';

@Component({
  selector: 'app-core-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})

export class BreadcrumbComponent {

  @select() breadcrumb$: Observable<Breadcrumb[]>;
  @select() cart$: Observable<CartItem[]>;

  cart: CartItem[];
  breadList = [];

  isUserLoggedIn: boolean;
  userType: number = null;

  url: string;
  desktopMode = true;
  hide: boolean;

  coupons: Coupon[];

  constructor(
    private globalEventService: GlobalEventsManagerService,
    private ngRedux: NgRedux<IAppState>,
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService, // TODO remove after REDUX
    private router: Router,
  ) {
    this.globalEventService.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
      this.userType = Number(this.globalEventService.userType.getValue());
    });

    this.globalEventService.desktopMode.subscribe(message => {
      this.desktopMode = message
    });

    this.globalEventService.hideSource.subscribe(message => {
      this.hide = message;
    });


    this.breadcrumb$.subscribe(elements => {
      this.breadList = elements['list'];
    });

    this.cart$.subscribe(elements => {
      this.cart = elements['list'];
    });

    this.couponService.getAvailableCoupons()
      .subscribe(coupons => {
        this.coupons = coupons;
      }, err => {
        console.log(err);
      });

    this.url = this.router.url;
  }

  navigateTo(value) {
    if (value) {
      this.router.navigate([value]);
    }
  }

}
