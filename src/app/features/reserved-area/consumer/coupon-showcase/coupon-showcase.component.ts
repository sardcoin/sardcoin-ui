import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {DomSanitizer} from '@angular/platform-browser';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CartItem} from '../../../../shared/_models/CartItem';
import {StoreService} from '../../../../shared/_services/store.service';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Coupon} from '../../../../shared/_models/Coupon';
import {CartActions} from '../cart/redux-cart/cart.actions';

@Component({
  selector: 'app-feature-reserved-area-consumer-showcase',
  templateUrl: './coupon-showcase.component.html',
  styleUrls: ['./coupon-showcase.component.scss']
})
export class FeatureReservedAreaConsumerShowcaseComponent implements OnInit, OnDestroy {

  coupons: any;
  modalRef: BsModalRef;
  maxQuantity = 1;
  isMax = false;
  myForm: FormGroup;

  constructor(
    private couponService: CouponService,
    private breadcrumbActions: BreadcrumbActions,
    private _sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private localStore: StoreService,
    private cartActions: CartActions,
    private router: Router,
    private toastr: ToastrService,
    protected localStorage: LocalStorage,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.loadCoupons();
    this.addBreadcrumb();
  }

  ngOnDestroy() {
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

  async openModal(template: TemplateRef<any>, coupon: Coupon) { // TODO Error message if you cannot add more coupons (ex. purchasable)

    this.maxQuantity = await this.cartActions.getQuantityAvailableForUser(coupon.id);

    this.myForm = this.formBuilder.group({
      quantity: [1, Validators.compose([Validators.min(1), Validators.max(this.maxQuantity), Validators.required])]
    });

    this.isMax = this.myForm.value.quantity === this.maxQuantity;

    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }

  get f() {
    return this.myForm.controls;
  }

  decline(): void {
    this.isMax = false;
    this.modalRef.hide();
  }

  details(coupon: any) {
    this.couponService.setCoupon(coupon);
    this.router.navigate(['/reserved-area/consumer/details']);
  }

  async addToCart(coupon: Coupon) {
    if (this.myForm.invalid) {
      return;
    }

    const item: CartItem = {
      id: coupon.id,
      quantity: this.myForm.value.quantity
    };

    if (await this.cartActions.addElement(item)) {
      this.toastr.success( coupon.title + ' successfully added to the cart.', 'Coupon added.');
    } else {
      this.toastr.error(coupon.title + ' cannot be added to the cart.', 'Error adding the coupon');
    }

    this.modalRef.hide();
  }

  inCart(coupon_id: number) {
    return this.cartActions.isInCart(coupon_id) >= 0; // If true, the element exists and its index is been retrievd
  }

  viewCart() {
    this.router.navigate(['/reserved-area/consumer/cart']);
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
      return 'Free';
    }

    return '€ ' + price.toFixed(2);
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Consumer', '/reserved-area/consumer/'));
    bread.push(new Breadcrumb('Shopping', '/reserved-area/consumer/showcase'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }
}
