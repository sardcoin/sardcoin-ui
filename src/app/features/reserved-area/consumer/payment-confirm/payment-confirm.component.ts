import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {Router} from '@angular/router';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {UserService} from '../../../../shared/_services/user.service';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {StoreService} from '../../../../shared/_services/store.service';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import { of } from 'rxjs';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-confirm.component.html',
  styleUrls: ['./payment-confirm.component.scss']
})
export class PaymentConfirmComponent implements OnInit, OnDestroy {

  public payPalConfig?: PayPalConfig;

  cartArray: any;
  user: any;
  modalRef: BsModalRef;
  bread = [] as Breadcrumb[];
  totalAmount = 0;
  arrayTitle = [];
  getAffordables: any;


  constructor(private _sanitizer: DomSanitizer,
              private userService: UserService,
              private localStorage: LocalStorage,
              private localService: StoreService,
              private modalService: BsModalService,
              private router: Router,
              private toastr: ToastrService,
              private breadcrumbActions: BreadcrumbActions,
              private couponService: CouponService
              ) {

    this.cartArray = this.localStorage.getItem('cart');
    this.cartArray = this.localStorage.getItem('cart');
    this.userService.getUserById().subscribe( user => { this.user = user;
      this.returnGetAffordables();
      });

  }

  ngOnInit() {
    this.initConfig();
    this.addBreadcrumb();
    this.localStorage.getItem('cart').subscribe(cart => {
      this.cartArray = cart;
      for (const i of this.cartArray) {
          this.totalAmount += Number(i.price);
          this.arrayTitle.push(i.title);
      }
    });
    this.userService.getUserById().subscribe( user => { this.user = user;
      });

  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }
  addBreadcrumb() {
    this.bread = [] as Breadcrumb[];

    this.bread.push(new Breadcrumb('Home', '/'));
    this.bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    this.bread.push(new Breadcrumb('Consumer', '/reserved-area/consumer/'));
    this.bread.push(new Breadcrumb('payment-confirm', '/reserved-area/consumer/cart-detail-payment'));

    this.breadcrumbActions.updateBreadcrumb(this.bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});

  }
  buy(cartArray) {

    for (const i of cartArray) {
      let quantityBuy = 0;
      for (const j of this.getAffordables) {
        if (i.title === j.title) {
          if (quantityBuy < i.quantity) {
            quantityBuy++;
            this.couponService.buyCoupon(j.id)
              .subscribe(data => {
                this.localStorage.removeItem('cart').subscribe(() => {

                    this.router.navigate(['/reserved-area/consumer/bought']);
                });


              }, err => {
                console.log(err);
              });
          }
        }
      }
    }

    this.toastBuy();
    this.decline();
  }
  decline() {
    this.modalRef.hide();

  }
  retry() {
    this.router.navigate(['/reserved-area/consumer/cart']);

  }

  returnGetAffordables() {
    this.couponService.getAvailableCoupons().subscribe(
      data => {
        this.getAffordables = data;
      });
  }

  toastBuy() {
    this.toastr.success( 'Your purchase has successfully completed', 'Congratulations!');

  }


  private initConfig(): void {
    this.payPalConfig = new PayPalConfig(
      PayPalIntegrationType.ClientSideREST,
      PayPalEnvironment.Sandbox,
      {
        commit: true,
        client: {
          sandbox:
            'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R'
        },
        button: {
          label: 'paypal',
          layout: 'vertical'
        },
        onAuthorize: (data, actions) => {
          console.log('Authorize');
          return of(undefined);
        },
        onPaymentComplete: (data, actions) => {
          console.log('OnPaymentComplete');
        },
        onCancel: (data, actions) => {
          console.log('OnCancel');
        },
        onError: err => {
          console.log('OnError');
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
              total: 30.11,
              currency: 'USD',
              details: {
                subtotal: 30.00,
                tax: 0.07,
                shipping: 0.03,
                handling_fee: 1.00,
                shipping_discount: -1.00,
                insurance: 0.01
              }
            },
            custom: 'Custom value',
            item_list: {
              items: [
                {
                  name: 'hat',
                  description: 'Brown hat.',
                  quantity: 5,
                  price: 3,
                  tax: 0.01,
                  sku: '1',
                  currency: 'USD'
                },
                {
                  name: 'handbag',
                  description: 'Black handbag.',
                  quantity: 1,
                  price: 15,
                  tax: 0.02,
                  sku: 'product34',
                  currency: 'USD'
                }],
              shipping_address: {
                recipient_name: 'Brian Robinson',
                line1: '4th Floor',
                line2: 'Unit #34',
                city: 'San Jose',
                country_code: 'US',
                postal_code: '95131',
                phone: '011862212345678',
                state: 'CA'
              },
            },
          }
        ],
        note_to_payer: 'Contact us if you have troubles processing payment'
      }
    );
  }

}
