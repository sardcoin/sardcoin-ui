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
  isReady = false;
  cartArray: any;
  user: any;
  modalRef: BsModalRef;
  bread = [] as Breadcrumb[];
  totalAmount = 0.00;
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




    this.userService.getUserById().subscribe( user => { this.user = user;
      this.returnGetAffordables();
      });

  }

  ngOnInit() {
    console.log('Number(this.totalAmount.toFixed(2)) prima dell input', this.totalAmount);

    this.addBreadcrumb();
    this.localStorage.getItem('cart').subscribe(cart => {
      this.cartArray = cart;
      console.log('this.cartArray', this.cartArray);
      for (const i of this.cartArray) {
          this.totalAmount += i.price;

        this.arrayTitle.push(i.title);
      }
      console.log('Number(this.totalAmount.toFixed(2))', this.totalAmount);
      this.userService.getUserById().subscribe( user => { this.user = user;
        this.initConfig();
      });
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
        if (i.id === j.id) {
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

  // 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R' sandboxId del componente
  // ARhQLPVETgECFDXgvWgu4v8ULn4Lz-jEBCSehJR8h5QA_cHbzCvPDcyBNmHfC2ZU6JTggRnDK-73K97e sanboxId dell'app paypal mia
  private initConfig(): void {
    const totale = this.totalAmount;
    console.log('totale', this.totalAmount);

      this.payPalConfig = this.payPalConfig = new PayPalConfig(
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
          onPaymentComplete: (data, actions) => {
            console.log('OnPaymentComplete, data', data);
            console.log('OnPaymentComplete, actions', actions);

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
                total: totale,
                currency: 'EUR',

              },

            }
          ],
          note_to_payer: 'Contact us if you have troubles processing payment'
        }
      );
    }


}
