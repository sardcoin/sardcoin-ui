import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {Router} from '@angular/router';
import {UserService} from '../../../../shared/_services/user.service';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {Observable, of} from 'rxjs';
import {PayPalConfig, PayPalEnvironment, PayPalIntegrationType} from 'ngx-paypal';
import {CartItem} from '../../../../shared/_models/CartItem';
import {Coupon} from '../../../../shared/_models/Coupon';
import {select} from '@angular-redux/store';
import {CartActions} from '../cart/redux-cart/cart.actions';
import {environment} from '../../../../../environments/environment';
import {User} from '../../../../shared/_models/User';

@Component({
  selector: 'app-consumer-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy, AfterViewInit {

  @select() cart$: Observable<CartItem[]>;
  // @ViewChild('template') htmlSandbox: ElementRef;
  // @ViewChildren('div1,div2,div3') divs: QueryList<ElementRef>;

  cart: CartItem[];
  coupons: Coupon[] = [];
  user: User;
  modalRef: BsModalRef;
  totalAmount = 0;
  clientId = null;
  owner = null;
  public payPalConfig: PayPalConfig;

  constructor(private _sanitizer: DomSanitizer,
              private userService: UserService,
              private modalService: BsModalService,
              private router: Router,
              private cartActions: CartActions,
              private toastr: ToastrService,
              private breadcrumbActions: BreadcrumbActions,
              private couponService: CouponService
  ) {
    this.cart$.subscribe(elements => {
      this.cart = elements['list'];
      // console.log('this.cart', this.cart);
    });
    // in checkout si potrebbe fare un controllo, se nel carrello ci sono più producer, si rimanda a una pagina
    // per pagare ogni singolo producer, altrimenti si procede al pagamento
    this.couponService.getCouponById(this.cart[0].id).subscribe( coupon => {
        this.owner = coupon.owner;
        this.userService.getProducerFromId(this.owner).subscribe( owner => {
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

  openModal(template: TemplateRef<any>) {
    this.initConfig();
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }

  buy(paymentID) {
    this.couponService.buyCoupons(this.cart, paymentID).subscribe(response => {

        if (response['status']) {
          console.log('response', response)
          this.toastr.error('Si è verificato un errore durante la finalizzazione dell\'ordine.', 'Errore sull\'acquisto!');
        } else {
          this.cartActions.emptyCart();
          this.toastr.success('Ordine eseguito con sucesso.', 'Ordine completato!');
          this.router.navigate(['/reserved-area/consumer/bought']);
        }

        // console.log(response);
      }, err => {
        this.toastr.error('Si è verificato un errore durante la finalizzazione dell\'ordine.', 'Errore sull\'acquisto!');
        console.log(err);
      });

    this.closeModal();
  }

  closeModal() {
    this.modalRef.hide();
  }

  retry() {
    this.router.navigate(['/reserved-area/consumer/cart']);

  }

  private initConfig(): void {

    this.payPalConfig = new PayPalConfig(
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
    );
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
    if (price === 0) {
      return 'Gratis';
    }

    return '€ ' + price.toFixed(2);
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
