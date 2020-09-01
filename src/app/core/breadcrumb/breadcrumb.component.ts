import {Component, OnInit} from '@angular/core';
import { element } from 'protractor';
import {GlobalEventsManagerService} from '../../shared/_services/global-event-manager.service';
import {NgRedux, select} from '@angular-redux/store';
import {BehaviorSubject, Observable} from 'rxjs';
import {Breadcrumb} from './Breadcrumb';
import {IAppState} from '../../shared/store/model';
import {NavigationEnd, Router} from '@angular/router';
import {BreadcrumbActions} from './breadcrumb.actions';
import {CartItem} from '../../shared/_models/CartItem';
import {CouponService} from '../../shared/_services/coupon.service';
import {CategoriesService} from '../../shared/_services/categories.service';
import {Category} from '../../shared/_models/Category';
import {Coupon} from '../../shared/_models/Coupon';
import {FilterActions} from '../../features/reserved-area/consumer/coupon-showcase/redux-filter/filter.actions';
import {ToastrService} from 'ngx-toastr';
import {StoreService} from '../../shared/_services/store.service';
import {LoginState} from '../../features/authentication/login/login.model';
import {BreadcrumbState} from './breadcrumb.model';
import {CartState} from '../../features/reserved-area/consumer/cart/redux-cart/cart.model';

@Component({
  selector: 'app-core-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})

export class BreadcrumbComponent implements OnInit { // TODO to handle toast messages

  @select() breadcrumb$: Observable<BreadcrumbState>;
  @select() cart$: Observable<CartState>;
  @select() login$: Observable<LoginState>;

  cart: CartItem[];
  breadList = [];

  categories: Array<Category> = [];
  selectedCategory: number = 0;
  coupons: Array<Coupon> = [];
  searchText: string = '';
  public MAX_SUGGESTIONS = 10;
  showSuggestions: BehaviorSubject<boolean> = new BehaviorSubject(false);

  isUserLoggedIn: boolean;
  authPage = false;
  showcasePage = false;
  userType: number = null;

  desktopMode = true;
  hide: boolean;

  constructor(
    private globalEventService: GlobalEventsManagerService,
    private ngRedux: NgRedux<IAppState>,
    private localStore: StoreService,
    private breadcrumbActions: BreadcrumbActions,
    private filterActions: FilterActions,
    private couponService: CouponService,
    private categoriesService: CategoriesService,
    private router: Router,
    private toast: ToastrService
  ) {
  }

  async ngOnInit() {
    this.login$.subscribe(login => {
      this.isUserLoggedIn = login.isLogged;
      this.userType = parseInt(this.localStore.getType());
    });

    this.globalEventService.desktopMode.subscribe(message => this.desktopMode = message);
    this.globalEventService.hideSource.subscribe(message => this.hide = message);

    this.breadcrumb$.subscribe(elements => {
      ////console.log('elements.list', elements.list)
      this.breadList = elements.list;
    });
    this.cart$.subscribe(elements => this.cart = elements.list);

    this.authPage = this.router.url.includes('authentication');
    this.showcasePage = this.router.url.includes('showcase');

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.authPage = this.router.url.includes('authentication');
        this.showcasePage = this.router.url.includes('showcase');
      }
    });

    await this.getCategories();
    await this.getCouponsByCategory();
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

  async searchCoupons() {
    let coupons, text = this.searchText.replace(new RegExp(' ', 'g'), '-');
    let category: Category = {
      id: this.selectedCategory,
      name: this.selectedCategory === 0 ? 'Tutte le categorie' : this.categories.find(el => el.id === this.selectedCategory).name
    };

    try {
      if (text === '') {
        coupons = (await this.couponService.getAvailableByTextAndCatId('noText', this.selectedCategory).toPromise()) || [];
      } else {
        coupons = (await this.couponService.getAvailableByTextAndCatId(text, this.selectedCategory).toPromise()) || [];
      }
      for (let cp = 0; cp < coupons.length; cp++) {
        coupons[cp].description = coupons[cp].description.length > 150 ? coupons[cp].description.slice(0, 150) + '...' : coupons[cp].description;
      }
      // Se coupon è definito, lo lascia com'è, altrimenti assegna alla variabile un array vuoto
      this.filterActions.update(coupons, category, this.searchText);
      this.router.navigate(['/showcase']);
    } catch (e) {
      this.toast.error('La ricerca non è andata a buon fine. Prova con caratteri consentiti.', 'Errore durante la ricerca');
      console.error(e);
    }
  }

  navigateTo(value) {
    if (value) {
      this.router.navigate([value]);
    }
  }

  giveSuggestions() { // TODO refactor
    this.showSuggestions.next(this.searchText && this.searchText.length > 0);
  }

  showListSuggestions(show: boolean) {
    this.showSuggestions.next(show);
  }

  goToCouponDetails(coupon: Coupon) {
    let url = '/details/' + coupon.id + '-' + coupon.title.split(' ').toString().replace(new RegExp(',', 'g'), '-');
    this.searchText = coupon.title;
    this.router.navigate([url]);
  }

  getListElement(coupon: Coupon, part: number = 0) { // TODO try to color the string matched
    let i = coupon.description.toLowerCase().split(' ').findIndex(el => el.includes(this.searchText.toLowerCase())); // Index of the text found
    let result = '';

    // If there are less than 5 words before the text found, it shows every word before that
    if (i < 6) {
      result = coupon.description.split(' ').slice(0, 6).toString().replace(new RegExp(',', 'g'), ' ') + '...';
    } else {
      // If the text found is at the end of the description, it shows 10 words before it
      if ((i + 1) === coupon.description.split(' ').length) {
        result += '...' + coupon.description.split(' ').slice(i - 10, i).toString().replace(new RegExp(',', 'g'), ' ');
      } else {
        // If the text found is in the middle of the description, it shows something before and something after
        result += '...' + coupon.description.split(' ').slice(i - 5, i + 5).toString().replace(new RegExp(',', 'g'), ' ') + '...';
      }
    }

    // Starting from result, I divide the string in three ways: before, match occurrence, after
    switch (part) {
      case 1: // begin
        result = result.substr(0, result.toLowerCase().indexOf(this.searchText.toLowerCase()));
        break;
      case 2: // end
        result = result.substr(result.toLowerCase().indexOf(this.searchText.toLowerCase()) + this.searchText.length, result.length);
        break;
      default:
        result = coupon.description.split(' ').slice(0, 10).toString().replace(new RegExp(',', 'g'), ' ') + '...';
        break;
    }

    return result;
  }

  isOccurrenceInText(text: string) {
    return text.toLowerCase().includes(this.searchText.toLowerCase());
  }

  getTitleOccurrence(title: string, part: boolean) {
    return part
      ? title.substr(0, title.toLowerCase().indexOf(this.searchText.toLowerCase()))
      : title.substr(title.toLowerCase().indexOf(this.searchText.toLowerCase()) + this.searchText.length, title.length);
  }
}
