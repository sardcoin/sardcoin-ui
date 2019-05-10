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
import {FilterActions} from '../../features/reserved-area/consumer/coupon-showcase/redux-filter/filter.actions';

@Component({
  selector: 'app-core-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})

export class BreadcrumbComponent implements OnInit { // TODO to handle toast messages

  @select() breadcrumb$: Observable<Breadcrumb[]>;
  @select() cart$: Observable<CartItem[]>;

  cart: CartItem[];
  breadList = [];

  categories: Array<Category> = [];
  selectedCategory: number = 0;
  coupons: Array<Coupon> = [];
  searchText: string = '';
  public MAX_SUGGESTIONS = 10;
  showSuggestions: BehaviorSubject<boolean> = new BehaviorSubject(false);

  isUserLoggedIn: boolean;
  userType: number = null;

  url: string;
  desktopMode = true;
  hide: boolean;

  constructor(
    private globalEventService: GlobalEventsManagerService,
    private ngRedux: NgRedux<IAppState>,
    private breadcrumbActions: BreadcrumbActions,
    private filterActions: FilterActions,
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
      this.desktopMode = message;
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

    if (this.userType === 2) { // Consumer
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

  async getCouponsByCategory() {
    try {
      this.coupons = await this.couponService.getAvailableCouponsByCategoryId(this.selectedCategory).toPromise();
    } catch (e) {
      console.error(e);
    }
  }

  async onChange(value) {
    this.selectedCategory = parseInt(value);
    await this.getCouponsByCategory();
  }

  giveSuggestions() { // TODO refactor
    this.showSuggestions.next(this.searchText && this.searchText.length > 0);
  }

  showListSuggestions(show) {
    this.showSuggestions.next(show);
  }

  goToCouponDetails(coupon: Coupon) {
    let url = '/reserved-area/consumer/details/' + coupon.id + '-' + coupon.title.split(' ').toString().replace(new RegExp(',', 'g'), '-');
    this.searchText = coupon.title;
    this.router.navigate([url]);
  }

  getListElement(coupon: Coupon) {
    let i = coupon.description.toLowerCase().indexOf(this.searchText.toLowerCase());
    let j, result;

    if(i < 5) {
      // j = coupon.description.toLowerCase().substr() TODO aggiungere parole, controllo su quello - bug showcase
    } else {

    }

    // return result;

    return coupon.title + ' - ' + (i > 5 ? '...' + coupon.description.substr(i - 5, i + 15) : coupon.description.substr(i, i + 20)) + '...';
  }

  async searchCoupons() {
    let coupons;

    try {
      coupons = await this.couponService.getAvailableByTextAndCatId(this.searchText, this.selectedCategory).toPromise();
      this.filterActions.update(coupons);
      this.router.navigate(['/reserved-area/consumer/showcase']);
    } catch (e) {
      console.error(e);
    }
  }
}
