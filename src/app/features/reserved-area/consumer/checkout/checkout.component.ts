import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../shared/_services/user.service';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {Observable, of} from 'rxjs';
import {CartItem} from '../../../../shared/_models/CartItem';
import {Coupon} from '../../../../shared/_models/Coupon';
import {select} from '@angular-redux/store';
import {CartActions} from '../cart/redux-cart/cart.actions';
import {environment} from '../../../../../environments/environment';
import {User} from '../../../../shared/_models/User';
import {ICreateOrderRequest, IPayPalConfig} from 'ngx-paypal';
import {ngxLoadingAnimationTypes} from 'ngx-loading';
import {catchError, map} from 'rxjs/operators';
import {PaypalService} from '../../../../shared/_services/paypal.service';

@Component({
  selector: 'app-consumer-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy, AfterViewInit {

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
  // public payPalConfig: IPayPalConfig;
  token: string;

  loading = false;
  config = {
    animationType: ngxLoadingAnimationTypes.threeBounce,
    backdropBackgroundColour: 'rgba(0,0,0,0.1)',
    backdropBorderRadius: '4px',
    primaryColour: '#FFF',
    secondaryColour: '#FFF'
  };

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
        // console.log('client_id', owner.client_id);
      });
    });


  }

  async ngOnInit() {
    this.addBreadcrumb();

    this.userService.getUserById().subscribe(user => {
      this.user = user;
    });

    const token = this.route.snapshot.queryParamMap.get('token');

    if(token && token !== 'undefined') {
      this.token = token;
      this.router.navigate([], { replaceUrl: true});
    }


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

  openModal(template: TemplateRef<any> | ElementRef, ignoreBackdrop: boolean = false) {
    // this.initConfig();
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered', ignoreBackdropClick: ignoreBackdrop, keyboard: !ignoreBackdrop});
  }

  async setCheckout() {
    let response;
    this.loading = true;

    try {
      response = await this.paypalService.setCheckout(this.cart).toPromise();
      this.openModal(this.paymentModal, true);
      window.location.href = response['link'];
    } catch (e) {
      console.error(e);
    }
  }

  async confirmPayment() {
    let response;

    try {
      response = await this.paypalService.pay(this.token).toPromise();

      // TODO impostare messaggio pagamento in attesa

      if(response['paid']) {
        this.toastr.success('Coupon pagati', 'Pagamento riuscito!');
      }
    } catch (e) {
      console.error(e);
    }
  }

  buy() {

    this.couponService.buyCoupons(this.cart).subscribe(response => {

      if (response['status']) {
        console.log('response', response);
        this.toastr.error('Si è verificato un errore durante la finalizzazione dell\'ordine.', 'Errore sull\'acquisto!');

        this.closeModal();
      } else {
        this.cartActions.emptyCart();
        this.toastr.success('Ordine eseguito con sucesso.', 'Ordine completato!');
        this.router.navigate(['/reserved-area/consumer/bought']);

        this.closeModal();
      }

      // console.log(response);
    }, err => {
      console.warn('Entro in error su buy');
      console.error(err);
      throw new Error('Error on buy coupon');
    });

    // throw new Error('prova');
  }

  closeModal() {
    this.modalRef.hide();
  }

  retry() {
    this.router.navigate(['/reserved-area/consumer/cart']);

  }

  /*private initConfig(): void {

    let response;
    let finalized = true;

    this.payPalConfig = {
      currency: 'EUR',
      clientId: this.clientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: '30.00',
              /!*breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '9.99'
                }
              }*!/
            },
            /!*            items: [
                          {
                            name: 'Enterprise Subscription',
                            quantity: '1',
                            category: 'DIGITAL_GOODS',
                            unit_amount: {
                              currency_code: 'EUR',
                              value: '9.99',
                            }
                          }
                        ],*!/
            payee: {
              email_address: 'sardcoin-producer2@gmail.com',
              merchant_id: 'unknown'
            }
          },
          {
            amount: {
              currency_code: 'EUR',
              value: '30.00',
            },
            payee: {
              email_address: 'sardcoin2018-facilitator@gmail.com',
              merchant_id: 'unknown'
            }
          }
        ]
      },
      advanced: {
        updateOrderDetails: {
          commit: true
        },
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);

        // return this.couponService.buyCoupons(this.cart);//.pipe(map((res) => res), catchError(e => of(e)));

        /!*if (!finalized) {
          throw new Error('òkisjdaf');
        }*!/
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);

        this.closeModal();
        this.toastr.error('Si è verificato un errore durante la finalizzazione dell\'ordine.', 'Errore sull\'acquisto!');
      },
      onClick: async () => {
        console.log('onClick');
      },
    };

    /!*this.payPalConfig = new PayPalConfig(
      PayPalIntegrationType.ClientSideREST,
      PayPalEnvironment.Sandbox,
      {
        commit: true,
        client: {
          sandbox:
              this.clientId,
        },
        button: {
          label: 'paypal',
          layout: 'vertical'
        },
        onAuthorize: (data, actions) => {
          console.log('Authorize', data, actions);
          return of(undefined);
        },
        onPaymentComplete: (data, actions) => { // TODO chiamare il backend per verificare la transazione
          console.log('OnPaymentComplete, data', data);
          const paymentID = data.paymentID;

          console.log('OnPaymentComplete, actions', actions);
          this.buy(paymentID);
        },
        onCancel: (data, actions) => {
          console.log('OnCancel');
        },
        onError: err => {
          console.log('OnError');
          console.log(err);
        },
        onClick: () => {

          console.log('onClick');


        },
        validate: (actions) => {
          console.log('validate', actions);
        },
        experience: {
          noShipping: true,
          brandName: 'Angular PayPal'
        },
        transactions: [
          {
            amount: {
              total: this.totalAmount,
              currency: 'EUR',
            },

          }
        ],
        note_to_payer: 'Contact us if you have troubles processing payment'
      }
    );*!/
  }*/

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


  ngAfterViewInit() {

    // console.log('this.htmlSandbox', this.htmlSandbox);
    // console.log(this.divs);
  }

}


