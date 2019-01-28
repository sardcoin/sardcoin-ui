import {Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {StoreService} from '../../../../shared/_services/store.service';
import {Coupon} from '../../../../shared/_models/Coupon';
import {CartItem} from '../../../../shared/_models/CartItem';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {CartActions} from './redux-cart/cart.actions';
import {GlobalEventsManagerService} from '../../../../shared/_services/global-event-manager.service';

@Component({
  selector: 'app-consumer-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CartComponent implements OnInit, OnDestroy {

  @select() cart$: Observable<CartItem[]>;

  coupons: Coupon[] = [];
  cart: CartItem[];
  modalRef: BsModalRef;
  isDesktop: boolean;

  constructor(
    private _sanitizer: DomSanitizer,
    private couponService: CouponService,
    private localStorage: StoreService,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService,
    private breadcrumbActions: BreadcrumbActions,
    private cartActions: CartActions,
    private globalEventService: GlobalEventsManagerService,

  ) {
    this.cart$.subscribe(elements => {
      this.cart = elements['list'];
    });
  }

  async ngOnInit() {
    this.addBreadcrumb();
    this.globalEventService.desktopMode.subscribe(message => this.isDesktop = message);
    await this.loadCart();
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  async loadCart() {
    this.cart.forEach(async element => {

      const elementToPush = await this.couponService.getCouponById(element.id).toPromise();
      const maxQuantity = await this.cartActions.getQuantityAvailableForUser(element.id);

      elementToPush.quantity = element.quantity;
      elementToPush.max_quantity = maxQuantity;

      this.coupons.push(elementToPush);
    });
  }

  async onDelete(coupon: Coupon) {

    if (await this.cartActions.deleteElement(coupon.id)) {
      this.toastr.success(coupon.title + ' è stato eliminato.', 'Coupon eliminato');
      this.coupons = this.coupons.filter((element) => element.id !== coupon.id);
    } else {
      this.toastr.error(coupon.title + 'non è stato eliminato.', 'Errore di eliminazione');
    }

    this.modalRef.hide();
  }

  async changeQuantity(coupon: Coupon, increment: boolean) {
    let index;
    const newQuantity = increment ? coupon.quantity + 1 : coupon.quantity - 1;

    const item: CartItem = {
      id: coupon.id,
      quantity: newQuantity
    };

    if(await this.cartActions.addElement(item)){
      index = this.coupons.findIndex((element) => element.id === coupon.id);
      this.coupons[index].quantity = newQuantity;
    }
  } /* If increment is true, then an add of quantity in the cart is performed, else a deletion is performed */

  emptyCart(){
    this.cartActions.emptyCart();
    this.closeModal();
  }

  retry() {
    this.router.navigate(['/reserved-area/consumer/showcase']);
  }

  openBought() {
    this.router.navigate(['/reserved-area/consumer/bought']);
  }

  goToDetailPayment() {
    this.router.navigate(['/reserved-area/consumer/checkout']);
  }

  formatUntil(inputDate) {
    if (inputDate === null) {
      return 'Illimitato';
    }

    const date = inputDate.toString().substring(0, inputDate.indexOf('T'));
    const time = inputDate.toString().substring(inputDate.indexOf('T') + 1, inputDate.indexOf('Z') - 4);

    return date + ' ' + time;
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

    // bread.push(new Breadcrumb('Home', '/'));
    // bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Home', '/reserved-area/consumer/'));
    bread.push(new Breadcrumb('Cart', '/reserved-area/consumer/cart'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  closeModal(): void {
    this.modalRef.hide();
  }

  details(coupon: Coupon) {
    this.couponService.setCoupon(coupon);
    this.router.navigate(['/reserved-area/consumer/details']);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }
}
