import {Component, OnInit} from '@angular/core';
import {GlobalEventsManagerService} from '../../shared/_services/global-event-manager.service';
import {NgRedux, select} from '@angular-redux/store';
import {BehaviorSubject, Observable} from 'rxjs';
import {Breadcrumb} from './Breadcrumb';
import {IAppState} from '../../shared/store/model';
import {Router} from '@angular/router';
import {BreadcrumbActions} from './breadcrumb.actions';
import {CartItem} from '../../shared/_models/CartItem';
import {CouponService} from '../../shared/_services/coupon.service';
import {CategoriesService} from '../../shared/_services/categories.service';
import {Category} from '../../shared/_models/Category';
import {Coupon} from '../../shared/_models/Coupon';

@Component({
  selector: 'app-core-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})

export class BreadcrumbComponent implements OnInit{

  @select() breadcrumb$: Observable<Breadcrumb[]>;
  @select() cart$: Observable<CartItem[]>;

  cart: CartItem[];
  breadList = [];

  categories: Array<Category> = [];
  coupons: Array<Coupon> = [];
  searchText: string = "";
  showSuggestions: BehaviorSubject<boolean>  = new BehaviorSubject(false);

  isUserLoggedIn: boolean;
  userType: number = null;

  url: string;
  desktopMode = true;
  hide: boolean;

  constructor(
    private globalEventService: GlobalEventsManagerService,
    private ngRedux: NgRedux<IAppState>,
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService, // TODO remove after REDUX
    private categoriesService: CategoriesService,
    private router: Router,
  ) {
  }

  async ngOnInit() {
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

    this.url = this.router.url;

    if(this.userType === 2) { // Consumer
      await this.getCategories();
      await this.getCouponsByCategory();
    }
  }

  navigateTo(value) {
    if (value) {
      this.router.navigate([value]);
    }
  }

  async getCategories() {
    try {
      this.categories = await this.categoriesService.getAll().toPromise();
    } catch (e) {
      console.error(e);
    }
  }

  async getCouponsByCategory(category_id: number = 0) {
    try {
      if(category_id === 0) {
        this.coupons = await this.couponService.getAvailableCoupons().toPromise();
      } else {
        this.coupons = await this.couponService.getAvailableCouponsByCategoryId(category_id).toPromise();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async onChange(value) {
    await this.getCouponsByCategory(parseInt(value));
    console.warn(this.coupons);
  }

  giveSuggestions(){
    if(this.searchText && this.searchText.length > 0) {
      this.showSuggestions.next(true);
    } else {
      this.showSuggestions.next(false);
    }
  }

  goToCouponDetails(coupon: Coupon) {
    this.searchText = coupon.title;
    // this.showListSuggestions(false);

    let url = '/reserved-area/consumer/details/' + coupon.id + '-' + coupon.title.split(' ').toString().replace(new RegExp(',', 'g'), '-');
    // this.router.navigate([url]);
    // this.showSuggestions.next(false); TODO check this
    console.log(url);
  }

  showListSuggestions(show){
    console.warn('TO SHOW: ', show);
    this.showSuggestions.next(show);
  }
}
