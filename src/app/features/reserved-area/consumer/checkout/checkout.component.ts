import { select } from '@angular-redux/store';
import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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
  coupon: Coupon

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
      this.cart = elements['list'];
    });

    this.couponService.getCouponById(this.cart[0].id).subscribe(coupon => {
      this.owner = coupon.owner;
      //console.log('this.owner', this.owner)
      this.userService.getProducerFromId(this.owner).subscribe(owner => {
        this.clientId = owner.client_id;
      });
    });

    this.orderService.getLastOrder().subscribe(lastId => {
      this.lastId = lastId.lastId + 1;
      //console.log('lastId', this.lastId);
    });

  }

  async ngOnInit(): Promise<any> {
    this.addBreadcrumb();
    this.userService.getUserById().subscribe(user => {
      this.user = user;
    });
    this.coupon = await this.couponService.getCouponById(this.cart[0].id).toPromise()
    //console.log('coupon', this.coupon);
    const producer: User = await this.userService.getProducerFromId(this.coupon.owner).toPromise()
    //console.log('producer', producer);
    this.producer = producer;
    await this.loadCart();
    console.warn(this.cart);
    const token = this.route.snapshot.queryParamMap.get('token');
    const error = this.route.snapshot.queryParamMap.get('err');
    //console.log('token', token);
    //console.log('this.route.snapshot.queryParamMap', this.route.snapshot.queryParamMap);
    //console.log('total amount in', this.totalAmount);

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
    this.cart.forEach(async element => {

      const elementToPush = await this.couponService.getCouponById(element.id).toPromise();
      elementToPush.quantity = element.quantity;

      this.totalAmount += element.quantity * elementToPush.price;
      //console.log('total amount', this.totalAmount);

      this.coupons.push(elementToPush);
    });

    //console.log('carta', this.cart);
  }
  //TODO eliminare, pagamento vecchio

  // async setCheckout() {
  //   let response;
  //   this.loading = true;
  //
  //   // this.openModal(this.paymentModal, true);
  //
  //   try {
  //     response = await this.paypalService.setCheckout(this.cart).toPromise();
  //     console.log('response', response)
  //     console.log('response link', response['link']);
  //     // window.location.href = response['link'];
  //   } catch (e) {
  //     console.error(e);
  //     this.toastr.error('Non è stato possibile elaborare il pagamento. Per favore, riprova.', 'Errore inizializzando il pagamento.');
  //   }
  //   //this.closeModal()
  // }
  //
  // confirmPayment = async () => { // It performs
  //   let buyResponse;
  //   let title = '';
  //   let message = '';
  //
  //   try {
  //     console.warn(this.cart);
  //
  //     for (let item of this.cart) {
  //       if (item.price !== 0) {
  //         this.openModalAwaitConfirmPayment(this.buyWait, true);
  //         break;
  //       }
  //     }
  //     buyResponse = await this.couponService.buyCoupons(this.cart).toPromise();
  //
  //     this.toastr.success('Coupon pagati', 'Pagamento riuscito!');
  //     this.cartActions.emptyCart();
  //     this.closeModalAwaitConfirmPayment();
  //     // this.router.navigate(['/bought']);
  //
  //
  //
  //
  //   } catch (e) {
  //
  //     if (e.error.call === 'buyCoupons') { // Errore durante l'ordine (coupon non più presenti oppure non più acquistabili)
  //       title = 'Errore finalizzando l\'ordine';
  //       message = 'Errore durante la conclusione dell\'ordine: i coupon potrebbero essere terminati oppure non più acquistabili.';
  //     }
  //
  //     if (e.error.call === 'pay') { // Errore durante il pagamento
  //       title = 'Errore durante il pagamento';
  //       message = 'Il pagamento non è andato a buon fine. Per favore, riprova e verifica il tuo saldo.';
  //     }
  //
  //     console.error(e.error);
  //
  //     this.toastr.error(message, title);
  //     // this.closeModal();
  //   }
  // };

  openModal(template: TemplateRef<any> | ElementRef, ignoreBackdrop: boolean = false) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered', ignoreBackdropClick: ignoreBackdrop, keyboard: !ignoreBackdrop});
  }

  closeModal() {
    this.modalRef.hide();
    this.modalService.hide(0);
  }


  openModalPayment(template: TemplateRef<any> | ElementRef, ignoreBackdrop: boolean = false) {
    try {
      const preBuyValue = this.couponService.preBuy(this.cart)
        .toPromise()
    } catch (e) {
      console.log('error prepare coupon', e)

    }
    if (this.cart[0].price != 0) {
      this.initConfig();
    }
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered', ignoreBackdropClick: ignoreBackdrop, keyboard: !ignoreBackdrop});
  }

  closeModalPayment() {
    this.modalRef.hide();
  }

  async preBuy(cart: Array<CartItem>): Promise<any> {
   const res = await this.couponService.preBuy(cart)
     .toPromise();
   console.log('res preBuy', res);
  }

  async removePreBuy(cart: Array<CartItem>): Promise<any> {
    const res = await this.couponService.removePreBuy(cart)
      .toPromise();
    console.log('res removePreBuy', res);
  }

  openModalAwaitConfirmPayment(template: TemplateRef<any> | ElementRef, ignoreBackdrop: boolean = false) {
    this.modalRefAwaitConfirmPayment = this.modalService.show(template,
      {class: 'modal-md modal-dialog-centered', ignoreBackdropClick: ignoreBackdrop, keyboard: !ignoreBackdrop});
  }

  closeModalAwaitConfirmPayment() {
    this.modalRefAwaitConfirmPayment.hide();
    this.modalService.hide(1);
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
        window.location.reload(true)
        console.log('refresh')
    })
  }


  private async initConfig(): Promise<any> {

      this.refreshDeletePaypal();

      //console.log('onClick preBuyValue',preBuyValue);
      if (this.cart[0].price > 0) {
      const clientId: string = this.producer.client_id
      //console.log('producer', this.producer)
      // TODO optimize call fetch
      const link = 'http://localhost:8080/paypal/createOrder/' +
        this.cart[0].id + '/' + this.cart[0].price + '/' + this.coupon.owner + '/' +
        this.cart[0].quantity + '/' + this.user.id;
      this.payPalConfig = {
        clientId: clientId,
        style: {label: 'pay'},
        // for creating orders (transactions) on server see
        // https://developer.paypal.com/docs/checkout/reference/server-integration/set-up-transaction/
        //TODO da mettere in paypal.service per poter fare chiamate autorizzate solo ai consumer/registrati
        createOrderOnServer: data => fetch(link)
          .then(async res => {
            const result = await res.json()
            // console.log('risposta server creazione  1 then', result)

            return result;
          })
          .then(async order => {
            const orderId = (await order).id
            //console.log('risposta server creazione  2 then', orderId);

            return orderId;
          }),
        onApprove: (data, actions) => {
          return;
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
          actions.order.get()
            .then(async details => {
              console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: async (data) => {
          this.closeModalPayment();
          this.openModalAwaitConfirmPayment(this.buyWait, true);

          try {
            const payment_id = data.id
            const buy = await this.couponService.buyCoupons(this.cart, payment_id, this.coupon.owner)
              .toPromise()
            this.closeModalAwaitConfirmPayment()
            this.toastr.success('Coupon pagati', 'Pagamento riuscito!');
            this.cartActions.emptyCart(); // TODO a fine test decomentare
            console.log('buy: ', buy);
            this.router.navigate(['/bought']); // TODO a fine test decomentare

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

          console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
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
        onClick: async (data, actions) => {

          console.log('onClick', data, actions);
        }
      };
    } else {
      try {
        const buy = await this.couponService.buyCoupons(this.cart)
          .toPromise();
        this.closeModalPayment();
      } catch (e) {

      }


    }
  }

  private async getFree(): Promise <any> {

    this.closeModalPayment();

    try {
      const buy = await this.couponService.buyCoupons(this.cart,undefined, this.coupon.owner)
        .toPromise()
      this.toastr.success('Coupon ottenuto', 'Hai ricavuto un coupon gratis!');
      this.cartActions.emptyCart(); // TODO a fine test decomentare
      //console.log('buy free: ', buy);
      this.router.navigate(['/bought']); // TODO a fine test decomentare

    } catch (e) {
      let title = '';
      let message = '';

      if (e.error.call === 'buyCoupons') { // Errore durante l'ordine (coupon non più presenti oppure non più acquistabili)
        title = 'Errore finalizzando l\'ordine';
        message = 'Errore durante la conclusione dell\'ordine: i coupon potrebbero essere terminati oppure non più acquistabili.';

      }

      console.error(e.error);

      this.toastr.error(message, title);

    }
  }

}


