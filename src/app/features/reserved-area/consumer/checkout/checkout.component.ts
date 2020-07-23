import { select } from '@angular-redux/store';
import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
// paypal
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Breadcrumb } from '../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { CartItem } from '../../../../shared/_models/CartItem';
import { Coupon } from '../../../../shared/_models/Coupon';
import { User } from '../../../../shared/_models/User';
import { CouponService } from '../../../../shared/_services/coupon.service';
import { OrderService } from '../../../../shared/_services/order.service';
import { PaypalService } from '../../../../shared/_services/paypal.service';
import { UserService } from '../../../../shared/_services/user.service';
import { CartActions } from '../cart/redux-cart/cart.actions';
import { CartState } from '../cart/redux-cart/cart.model';

@Component({
  selector: 'app-consumer-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;

  @ViewChild('paymentModal') paymentModal: ElementRef;
  @ViewChild('buyWait') buyWait: ElementRef;
  @select() cart$: Observable<CartState>;

  cart: CartItem[];
  coupons: Coupon[] = [];
  user: User;
  modalRef: BsModalRef;
  modalRefAwaitConfirmPayment: BsModalRef;
  totalAmount = 0;
  clientId = null;
  owner = null;
  token: string;
  paymentError = true;
  lastId = 0;
  loading = false;
  payPalConfig ?: IPayPalConfig;
  producer: User;
  coupon: Coupon;
  couponCart: CartItem;

  constructor(private _sanitizer: DomSanitizer,
              private userService: UserService,
              private modalService: BsModalService,
              private router: Router,
              private route: ActivatedRoute,
              private cartActions: CartActions,
              private toastr: ToastrService,
              private breadcrumbActions: BreadcrumbActions,
              private couponService: CouponService,
              private paypalService: PaypalService,
              private  orderService: OrderService

  ) {
    this.cart$.subscribe(elements => {
      this.cart = elements.list;

    });
    Number(this.cart.filter(x => x.id === Number(this.route.snapshot.paramMap.get('id')))[0]);
    this.couponCart  =  this.cart.filter(x => x.id === Number(this.route.snapshot.paramMap.get('id')))[0];
    this.couponService.getCouponById(this.couponCart.id)
    .subscribe(coupon => {
      this.owner = coupon.owner;
      this.coupon = coupon
      this.userService.getProducerFromId(this.owner).subscribe(owner => {
        this.clientId = owner.client_id;
      });
    });

    this.orderService.getLastOrder().subscribe(lastId => {
      this.lastId = lastId.lastId + 1;
    });

  }

  async ngOnInit(): Promise<any> {
    this.addBreadcrumb();
    this.userService.getUserById().subscribe(user => {
      this.user = user;
    });
    this.coupon = await this.couponService.getCouponById(this.couponCart.id).toPromise()
    const producer: User = await this.userService.getProducerFromId(this.coupon.owner).toPromise()
    this.producer = producer;
    await this.loadCart();
    console.warn(this.cart);
    const token = this.route.snapshot.queryParamMap.get('token');
    const error = this.route.snapshot.queryParamMap.get('err');

    if (error && error === 'true') {
      this.toastr.error('Qualcosa è andato storto durante il pagamento. Per favore, riprova.', 'Errore durante il pagamento');
      this.token = null;
    } else {
      if (token && token !== 'undefined') {
        this.token = token;
      }
      this.paymentError = false;
    }

    this.router.navigate([], {replaceUrl: true});


  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

   async loadCart() {

      await this.cartActions.moveTofirst(this.couponCart.id);
      const elementToPush = await this.couponService.getCouponById(this.couponCart.id).toPromise();

      this.totalAmount = this.couponCart.price * this.couponCart.quantity
      this.coupons.push(elementToPush);

  }

  openModal(template: TemplateRef<any> | ElementRef, ignoreBackdrop: boolean = false) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered', ignoreBackdropClick: ignoreBackdrop, keyboard: !ignoreBackdrop});
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }


  openModalPayment(template: TemplateRef<any> | ElementRef, ignoreBackdrop: boolean = false) {
    console.log('openModalPayment')
    try {
      const preBuyValue = this.couponService.preBuy(this.cart)
        .toPromise()
    } catch (e) {
      console.log('error prepare coupon', e)

    }

    if (this.coupon.price != 0) {
      this.initConfig(this.cart);
    } else {
      this.refreshDeletePaypal();

    }
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered', ignoreBackdropClick: ignoreBackdrop, keyboard: !ignoreBackdrop});
  }

  closeModalPayment() {
    if (this.modalRef) {
      this.modalRef.hide();
    }

  }

  closeModalAwaitConfirmPayment() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }


  retry() {
    this.router.navigate(['/cart']);

  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    // bread.push(new Breadcrumb('Home', '/'));
    // bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Checkout', '/checkout'));

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

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  async refreshDeletePaypal() {

    await this.delay(100000)
      .then(refresh => {
        if (window.location.href.includes('checkout')) {
          window.location.reload(true)
          console.log('refresh')
        }
      })
  }


  private async initConfig(cart): Promise<any> {

    this.refreshDeletePaypal();
    console.log('initConfig');
    if (this.coupon.price > 0) {
      const clientId: string = this.producer.client_id;
      this.payPalConfig = {
        clientId: clientId,
        currency: "EUR",
        style: {label: 'pay'},
        // for creating orders (transactions) on server see
        // https://developer.paypal.com/docs/checkout/reference/server-integration/set-up-transaction/
        //TODO da mettere in paypal.service per poter fare chiamate autorizzate solo ai consumer/registrati
        createOrderOnServer: data => this.paypalService.createOrder(this.coupon.id, this.coupon.price, this.coupon.owner,  this.couponCart.quantity, this.user.id)
          // fetch(link)
          .then( res => {
            const result =  res

            return result;
          })
          .then( order =>  {
            const orderId = ( order).id
            console.log('risposta server creazione  2 then', order);

            return orderId;
          }),
        onApprove: (data, actions) => {

          console.log('onApprove - transaction was approved, but not authorized', data, actions);
          actions.order.get()
            .then(async details => {
              console.log('onApprove - you can get full order details inside onApprove: ', details);
              try {
                const payment_id = details.id
                this.closeModalPayment()
                this.blockUI.start('Attendi la registrazione su Blockchain'); // Start blocking

                const buy = await this.couponService.buyCoupons(this.cart, payment_id, this.coupon.owner)
                  .toPromise()
                // this.closeModalAwaitConfirmPayment()
                console.log('buy: ', buy);

                this.router.navigate(['/bought']); // TODO a fine test decomentare
                this.blockUI.stop()
                  this.toastr.success('', 'Pagamento riuscito!');
                this.cartActions.deleteFirstItem(this.couponCart.id); //delete firs element

              } catch (e) {
                let title = '';
                let message = '';
                this.closeModalAwaitConfirmPayment()

                if (e.error.call === 'buyCoupons') { // Errore durante l'ordine (coupon non più presenti oppure non più acquistabili)
                  title = 'Errore finalizzando l\'ordine';
                  message = 'Errore durante la conclusione dell\'ordine: i coupon potrebbero essere terminati oppure non più acquistabili.';

                }

                if (e.error.call === 'pay') { // Errore durante il pagamento

                  title = 'Errore durante il pagamento';
                  message = 'Il pagamento non è andato a buon fine. Per favore, riprova e verifica il tuo saldo.';
                }

                console.error(e.error);

                this.toastr.error(message, title);

              }
            });

        },

        onCancel: (data, actions) => {
          this.couponService.removePreBuy(this.cart)
            .toPromise()
          this.closeModalPayment();

          console.log('OnCancel', data, actions);

        },
        onError: err => {
          this.couponService.removePreBuy(this.cart)
            .toPromise()
          this.closeModalPayment();

          console.log('OnError', err);
        },
        onClick:  (data, actions) => {

          console.log('onClick', data, actions);
        }
      };
    } else {
      try {

        const buy = await this.couponService.buyCoupons(this.cart)
          .toPromise();

        this.closeModalPayment();
      } catch (e) {
        this.blockUI.stop(); // Stop blocking

      }


    }
  }

  private async getFree(): Promise <any> {
    this.closeModalPayment();
    try {
      this.blockUI.start('Attendi la registrazione su Blockchain'); // Start blocking

      const buy = await this.couponService.buyCoupons(this.cart,undefined, this.coupon.owner)
        .toPromise()
      this.blockUI.stop(); // Stop blocking

      this.toastr.success('Coupon ottenuto', 'Hai ricevuto un coupon gratis!');
      this.cartActions.deleteFirstItem(this.couponCart.id); // delete first element
      this.router.navigate(['/bought']);

    } catch (e) {
      let title = '';
      let message = '';

      if (e.error.call === 'buyCoupons') { // Errore durante l'ordine (coupon non più presenti oppure non più acquistabili)
        title = 'Errore finalizzando l\'ordine';
        message = 'Errore durante la conclusione dell\'ordine: i coupon potrebbero essere terminati oppure non più acquistabili.';

      }

      console.error(e.error);
      this.blockUI.stop(); // Stop blocking

      this.toastr.error(message, title);

    }
  }
  byPassHTML(html: string) {
    return this._sanitizer.bypassSecurityTrustHtml(html)
  }

}
