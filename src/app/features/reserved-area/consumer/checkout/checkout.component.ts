import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
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
export class CheckoutComponent implements OnInit, OnDestroy {

  @select() cart$: Observable<CartItem[]>;

  cart: CartItem[];
  coupons: Coupon[] = [];
  user: User;
  modalRef: BsModalRef;
  totalAmount = 0;

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

      let elementToPush = await this.couponService.getCouponById(element.id).toPromise();
      elementToPush.quantity = element.quantity;

      this.totalAmount += element.quantity * elementToPush.price;

      this.coupons.push(elementToPush);
    });
  }

  openModal(template: TemplateRef<any>) {
    this.initConfig();
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }

  buy() {
    this.couponService.buyCoupons(this.cart).subscribe(response => {

        if(response['status']) {
          this.toastr.error('An error occurred during the finalizing of the order.', 'Error on purchase!');
        } else {
          this.cartActions.emptyCart();
          this.toastr.success('The order is successfully complete.', 'Order complete!');
          this.router.navigate(['/reserved-area/consumer/bought']);
        }

        console.log(response);
      }, err => {
        this.toastr.error('An error occurred during the finalizing of the order.', 'Error on purchase!');
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
            'ARhQLPVETgECFDXgvWgu4v8ULn4Lz-jEBCSehJR8h5QA_cHbzCvPDcyBNmHfC2ZU6JTggRnDK-73K97e'
        },
        button: {
          label: 'paypal',
          layout: 'vertical'
        },
        onAuthorize: (data, actions) => {
          console.log('Authorize');
          return of(undefined);
        },
        onPaymentComplete: (data, actions) => { // TODO chiamare il backend per verificare la transazione
          console.log('OnPaymentComplete, data', data);
          console.log('OnPaymentComplete, actions', actions);
          this.buy();
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
          console.log(actions);
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
      return 'Free';
    }

    return '€ ' + price.toFixed(2);
  }

  formatUntil(inputDate) {
    if (inputDate === null) {
      return 'Unlimited';
    }

    const date = inputDate.toString().substring(0, inputDate.indexOf('T'));
    const time = inputDate.toString().substring(inputDate.indexOf('T') + 1, inputDate.indexOf('Z') - 4);

    return date + ' ' + time;
  }

  imageUrl(path) {
    return this._sanitizer.bypassSecurityTrustUrl(environment.protocol + '://' + environment.host + ':' + environment.port + '/' + path);
  }

}
