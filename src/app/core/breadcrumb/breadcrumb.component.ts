import {Component, OnInit} from '@angular/core';
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
  authPage = false;
  showcasePage = false;
  userType: number = null;

  desktopMode = true;
  hide: boolean;

  constructor(
    private globalEventService: GlobalEventsManagerService,
    private ngRedux: NgRedux<IAppState>,
    private breadcrumbActions: BreadcrumbActions,
    private filterActions: FilterActions,
    private couponService: CouponService,
    private categoriesService: CategoriesService,
    private router: Router,
    private toast: ToastrService
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

    this.authPage = this.router.url.includes('authentication');
    this.showcasePage = this.router.url.includes('showcase');

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.authPage = this.router.url.includes('authentication');
        this.showcasePage = this.router.url.includes('showcase');
      }
    });


    if (!this.userType || this.userType === 2) { // Consumer
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
      console.log('Coupons: ', this.coupons);
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

    // If part is true, returns the first part, else the last part

    // console.warn({
    //   splittedArray: coupon.description.toLowerCase().split(' '),
    //   indexFound: i,
    //   total: result,
    //   first: result.substr(0, result.toLowerCase().indexOf(this.searchText.toLowerCase())),
    //   last: result.substr(result.toLowerCase().indexOf(this.searchText.toLowerCase()), result.length)
    // });
    // console.info('TOTAL RESULT: ', result);
    // console.warn('FIRST PART: ', result.substr(0, result.toLowerCase().indexOf(this.searchText.toLowerCase())));
    // console.warn('LAST PART: ', result.substr(result.toLowerCase().indexOf(this.searchText.toLowerCase()), result.length));

    // return part
    //   ? result.substr(0, result.toLowerCase().indexOf(this.searchText.toLowerCase()))
    //   : result.substr(result.toLowerCase().indexOf(this.searchText.toLowerCase()) + this.searchText.length, result.length);


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

  async searchCoupons() {
    let coupons;
    let category: Category = {
      id: this.selectedCategory,
      name: this.selectedCategory === 0 ? 'Tutte le categorie' : this.categories.find(el => el.id === this.selectedCategory).name
    };

    try {
      // Se coupon è definito, lo lascia com'è, altrimenti assegna alla variabile un array vuoto
      coupons = (await this.couponService.getAvailableByTextAndCatId(this.searchText, this.selectedCategory).toPromise()) || [];
      this.filterActions.update(coupons, category, this.searchText);
      this.router.navigate(['/showcase']);
    } catch (e) {
      this.toast.error('La ricerca non è andata a buon fine. Prova con caratteri consentiti.', 'Errore durante la ricerca');
      console.error(e);
    }
  }
}
