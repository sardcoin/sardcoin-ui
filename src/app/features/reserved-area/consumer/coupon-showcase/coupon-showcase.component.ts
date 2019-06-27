import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {DomSanitizer} from '@angular/platform-browser';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CartItem, ITEM_TYPE} from '../../../../shared/_models/CartItem';
import {StoreService} from '../../../../shared/_services/store.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Coupon} from '../../../../shared/_models/Coupon';
import {CartActions} from '../cart/redux-cart/cart.actions';
import {GlobalEventsManagerService} from '../../../../shared/_services/global-event-manager.service';
import {FilterActions} from './redux-filter/filter.actions';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {Category} from '../../../../shared/_models/Category';
import {LoginState} from '../../../authentication/login/login.model';

@Component({
  selector: 'app-feature-reserved-area-consumer-showcase',
  templateUrl: './coupon-showcase.component.html',
  styleUrls: ['./coupon-showcase.component.scss']
})
export class FeatureReservedAreaConsumerShowcaseComponent implements OnInit, OnDestroy {

  @select() filter$: Observable<Coupon[]>;
  @select() login$: Observable<LoginState>;

  coupons: Coupon[];
  category: Category;
  modalCoupon: Coupon;
  modalRef: BsModalRef;
  maxQuantity = 1;
  isMax = false;
  myForm: FormGroup;
  searchResults = false;
  searchText: string = null;
  userType = null;

  isUserLoggedIn: boolean;

  constructor(
    private couponService: CouponService,
    private GEManager: GlobalEventsManagerService,
    private breadcrumbActions: BreadcrumbActions,
    private _sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private localStore: StoreService,
    private cartActions: CartActions,
    private filterActions: FilterActions,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {

    this.filter$.subscribe(filter => {
      if (filter['list']) {
        this.coupons = filter['list'];
        this.searchText = filter['searchText'];
        this.category = filter['category'];
        this.searchResults = true;
      } else {
        this.loadCoupons();
        this.searchText = null;
        this.searchResults = false;
      }
    });

    this.login$.subscribe(login => {
      this.isUserLoggedIn = login['isLogged'];
    });

    this.userType = parseInt(this.localStore.getType());

    this.addBreadcrumb();
  }

  ngOnDestroy() {
    this.filterActions.clear();
    this.removeBreadcrumb();
  }

  loadCoupons() {
    this.couponService.getAvailableCoupons()
      .subscribe(coupons => {
        this.coupons = coupons;
      }, err => {
        console.log(err);
      });
  }

  async openModal(template: TemplateRef<any>, coupon: Coupon) {

    if(!this.isUserLoggedIn) {
      this.toastr.info('Per aggiungere un elemento al carrello devi prima effettuare l\'accesso.', 'Effettua l\'accesso!');
    } else {

      this.modalCoupon = coupon;

      this.maxQuantity = await this.cartActions.getQuantityAvailableForUser(coupon.id);

      this.myForm = this.formBuilder.group({
        quantity: [1, Validators.compose([Validators.min(1), Validators.max(this.maxQuantity), Validators.required])]
      });

      this.isMax = this.myForm.value.quantity === this.maxQuantity;

      if (this.maxQuantity > 0) {
        this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
      } else {
        this.toastr.error('Hai già raggiunto la quantità massima acquistabile per questo coupon o è esaurito.', 'Coupon non disponibile');
      }
    }
  }

  get f() {
    return this.myForm.controls;
  }

  decline(): void {
    this.isMax = false;
    this.modalRef.hide();
  }

  details(coupon: Coupon) {
    let url = this.router.url.includes('reserved-area') ? this.router.url.substr(0, this.router.url.lastIndexOf('/')) : '';
    url += this.couponService.getCouponDetailsURL(coupon);
    this.router.navigate([url]);
  }

  async addToCart(coupon: Coupon) {
    if (this.myForm.invalid) {
      return;
    }

    console.warn(coupon);

    const item: CartItem = {
      id: coupon.id,
      quantity: this.myForm.value.quantity,
      type: coupon.type
    };

    if (await this.cartActions.addElement(item)) {
      this.toastr.success(coupon.title + ' aggiunto al carrello.', 'Coupon aggiunto');
    } else {
      this.toastr.error(coupon.title + ' non è stato aggiunto al carrello.', 'Coupon non aggiunto');
    }

    this.modalRef.hide();
  }

  inCart(coupon_id: number) {
    return this.cartActions.isInCart(coupon_id) >= 0; // If true, the element exists and its index is been retrievd
  }

  viewCart() {
    this.router.navigate(['/cart']);
  }

  add() {
    this.myForm.controls.quantity.setValue((this.myForm.value.quantity + 1));
    this.isMax = this.myForm.value.quantity === this.maxQuantity;
  }

  del() {
    this.myForm.controls.quantity.setValue((this.myForm.value.quantity - 1));
    this.isMax = false;
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

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Shopping', '/showcase'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  getQuantityCart() {
    console.log('this.cartActions.getQuantityCart()', this.cartActions.getQuantityCart());
    return this.cartActions.getQuantityCart(); // If true, the element exists and its index is been retrievd
  }

  resetShowcase() {
    this.filterActions.clear();
  }
}
