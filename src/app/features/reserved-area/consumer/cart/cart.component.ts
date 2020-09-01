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
import {LoginState} from '../../../authentication/login/login.model';
import {CartState} from './redux-cart/cart.model';

@Component({
  selector: 'app-consumer-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CartComponent implements OnInit, OnDestroy {

  @select() cart$: Observable<CartState>;
  @select() login$: Observable<LoginState>;

  coupons: Coupon[] = [];
  cart: CartItem[];
  modalRef: BsModalRef;
  isDesktop: boolean;
  isUserLoggedIn: boolean;
  totalAmount = 0;


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
      if(elements['list'].length === 0) {
        this.toastr.info('Prima di accedere alla cassa, inserisci articoli al suo interno.', 'La cassa è vuota.');
        this.router.navigate(['/']);
      }

      this.cart = elements.list;
      ////console.log('elements', elements)
      this.totalAmount = elements.total;
    });

    this.login$.subscribe(login => {
      this.isUserLoggedIn = login.isLogged;
    })
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
      // this.totalAmount += element.//element.quantity * elementToPush.price;


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
      quantity: newQuantity,
        price: coupon.price,
      type: coupon.type
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
    this.router.navigate(['/showcase']);
  }

  openBought() {
    this.router.navigate(['/bought']);
  }

  goToDetailPayment() {
    this.router.navigate(['/checkout']);
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

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Cassa', '/cart'));

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
      let url = this.router.url.includes('reserved-area') ? this.router.url.substr(0, this.router.url.lastIndexOf('/')) : '';
      url += this.couponService.getCouponDetailsURL(coupon);
      this.router.navigate([url])
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }

  byPassHTML(html: string) {
    //console.log('html', html, typeof html)
    return this._sanitizer.bypassSecurityTrustHtml(html)
  }
}
