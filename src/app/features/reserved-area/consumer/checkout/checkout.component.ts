import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../shared/_services/user.service';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {Observable} from 'rxjs';
import {CartItem} from '../../../../shared/_models/CartItem';
import {Coupon} from '../../../../shared/_models/Coupon';
import {select} from '@angular-redux/store';
import {CartActions} from '../cart/redux-cart/cart.actions';
import {environment} from '../../../../../environments/environment';
import {User} from '../../../../shared/_models/User';
import {PaypalService} from '../../../../shared/_services/paypal.service';

@Component({
  selector: 'app-consumer-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  @ViewChild('paymentModal') paymentModal: ElementRef;
  @ViewChild('buyWait') buyWait: ElementRef;
  @select() cart$: Observable<CartItem[]>;

  cart: CartItem[];
  coupons: Coupon[] = [];
  user: User;
  modalRef: BsModalRef;
  totalAmount = 0;
  clientId = null;
  owner = null;
  token: string;
  paymentError: boolean = true;

  loading = false;

  constructor(private _sanitizer: DomSanitizer,
              private userService: UserService,
              private modalService: BsModalService,
              private router: Router,
              private route: ActivatedRoute,
              private cartActions: CartActions,
              private toastr: ToastrService,
              private breadcrumbActions: BreadcrumbActions,
              private couponService: CouponService,
              private paypalService: PaypalService
  ) {
    this.cart$.subscribe(elements => {
      this.cart = elements['list'];
    });

    this.couponService.getCouponById(this.cart[0].id).subscribe(coupon => {
      this.owner = coupon.owner;
      this.userService.getProducerFromId(this.owner).subscribe(owner => {
        this.clientId = owner.client_id;
      });
    });


  }

  async ngOnInit() {
    this.addBreadcrumb();

    this.userService.getUserById().subscribe(user => {
      this.user = user;
    });

    const token = this.route.snapshot.queryParamMap.get('token');
    const error = this.route.snapshot.queryParamMap.get('err');

    if(error && error === 'true') {
      this.toastr.error('Qualcosa è andato storto durante il pagamento. Per favore, riprova.', 'Errore durante il pagamento');
      this.token = null;
    } else {
      if(token && token !== 'undefined') {
        this.token = token;
      }
      this.paymentError = false;
    }

    this.router.navigate([], { replaceUrl: true});

    await this.loadCart();
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  async loadCart() {
    this.cart.forEach(async element => {

      const elementToPush = await this.couponService.getCouponById(element.id).toPromise();
      elementToPush.quantity = element.quantity;

      this.totalAmount += element.quantity * elementToPush.price;

      this.coupons.push(elementToPush);
    });
  }

  async setCheckout() {
    let response;
    this.loading = true;

    this.openModal(this.paymentModal, true);

    try {
      response = await this.paypalService.setCheckout(this.cart).toPromise();
      window.location.href = response['link'];
    } catch (e) {
      console.error(e);
      this.toastr.error('Non è stato possibile elaborare il pagamento. Per favore, riprova.', 'Errore inizializzando il pagamento.');
    }
  }

  async confirmPayment() { // It performs
    let payResponse, buyResponse;
    let title = '', message = '';

    try {

      this.openModal(this.buyWait, true);

      buyResponse = await this.couponService.buyCoupons(this.cart).toPromise();
      payResponse = await this.paypalService.pay(this.token, buyResponse.order_id).toPromise();

      if (payResponse['paid'] && buyResponse['success']) {
        this.toastr.success('Coupon pagati', 'Pagamento riuscito!');
      }
    } catch (e) {

      if (e.error['call'] === 'buyCoupons') { // Errore durante l'ordine (coupon non più presenti oppure non più acquistabili)
        title = 'Errore finalizzando l\'ordine';
        message = 'Errore durante la conclusione dell\'ordine: i coupon potrebbero essere terminati oppure non più acquistabili.'
      }

      if (e.error['call'] === 'pay') { // Errore durante il pagamento
        title = 'Errore durante il pagamento';
        message = 'Il pagamento non è andato a buon fine. Per favore, riprova e verifica il tuo saldo.'
      }

      console.error(e.error);

      this.toastr.error(message, title);
      this.closeModal();
    }
  }

  openModal(template: TemplateRef<any> | ElementRef, ignoreBackdrop: boolean = false) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered', ignoreBackdropClick: ignoreBackdrop, keyboard: !ignoreBackdrop});
  }

  closeModal() {
    this.modalRef.hide();
  }

  retry() {
    this.router.navigate(['/reserved-area/consumer/cart']);

  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    // bread.push(new Breadcrumb('Home', '/'));
    // bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Home', '/reserved-area/consumer/'));
    bread.push(new Breadcrumb('Checkout', '/reserved-area/consumer/checkout'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  formatPrice(price) {
    return price === 0 ? 'Gratis' : '€ ' + price.toFixed(2);
  }

  formatUntil(inputDate) {
    if (inputDate === null) {
      return 'Illimitato';
    }

    const date = inputDate.toString().substring(0, inputDate.indexOf('T'));
    const time = inputDate.toString().substring(inputDate.indexOf('T') + 1, inputDate.indexOf('Z') - 4);

    return date + ' ' + 'ore ' + time;
  }

  imageUrl(path) {
    return this._sanitizer.bypassSecurityTrustUrl(environment.protocol + '://' + environment.host + ':' + environment.port + '/' + path);
  }

}


