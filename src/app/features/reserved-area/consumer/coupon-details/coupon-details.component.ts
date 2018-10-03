import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {environment} from '../../../../../environments/environment';
import {Router} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {ToastrService} from 'ngx-toastr';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {CartItem} from '../../../../shared/_models/CartItem';
import {Coupon} from '../../../../shared/_models/Coupon';

@Component({
  selector: 'app-coupon-details',
  templateUrl: './coupon-details.component.html',
  styleUrls: ['./coupon-details.component.scss']
})

export class CouponDetailsComponent implements OnInit, OnDestroy {
  URLstring = 'http://' + environment.host + ':' + environment.port + '/';
  modalRef: BsModalRef;
  message: string;
  couponPass: any;
  cart = new Coupon();
  couponsPurchased: any;
  quantity = 1;
  couponsCheckCart: Coupon[];
  inCart = false;
  available = false;
  availability: string;


  constructor(
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    protected localStorage: LocalStorage
  ) {


  }

  ngOnInit() {


    this.couponService.currentMessage.subscribe(coupon => {
      this.couponPass = coupon;

      if (this.couponPass === null) {
        this.router.navigate(['/reserved-area/consumer/showcase']);
        this.addBreadcrumb();
         } else {
        this.URLstring = this.URLstring + this.couponPass.image;
        this.addBreadcrumb();

        this.couponService.getDistinctAvailables()
          .subscribe(coupons => {
            this.couponsPurchased = coupons;

            if (this.couponsPurchased !== null) {
              for (const i of this.couponsPurchased) {
                if (this.couponPass.title === i.title) {
                  this.available = true;
                }
              }
            }
            this.localStorage.getItem<any>('cart').subscribe((cart) => {
              this.couponsCheckCart = cart;

              if (this.couponsCheckCart !== null) {
                for (const i of this.couponsCheckCart) {
                  if (this.couponPass.title === i.title) {
                    this.inCart = true;
                  }
                }
              }
            });

            }, err => {
            console.log(err);
          });


      }

    });





  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Consumer', '/reserved-area/consumer/'));
    if ( this.couponPass !== null) { bread.push(new Breadcrumb(this.couponPass.title, '/reserved-area/consumer/showcase')); }

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

  formatUntil(until) {
    if (until === null) {
      return 'Unlimited';
    }

    return until;
  }

  formatFrom(dataFrom) {
    return dataFrom.toString().substring(0, dataFrom.indexOf('T'));
  }

  retry() {
    this.router.navigate(['/reserved-area/consumer/showcase']);
  }

  addToCart(coupon: Coupon) {
    this.localStorage.getItem<any>('cart').subscribe((cart) => {
      this.couponsCheckCart = cart;
      if (cart === null) {
        // console.log('cart null');

        this.localStorage.setItem('cart', [{id: coupon.id, quantity: this.quantity}]).subscribe(() => {
          this.inCart = true;
          this.addBreadcrumb();
          return;
        });
      } else {
        this.cart.id = this.couponPass.id;
        this.cart.quantity = this.quantity;
        this.cart.title = this.couponPass.title;
        this.cart.description = this.couponPass.description;
        this.cart.image = this.couponPass.image;
        this.cart.timestamp = this.couponPass.timestamp;
        this.cart.price = this.couponPass.price;
        this.cart.valid_from = this.couponPass.valid_from;
        this.cart.valid_until = this.couponPass.valid_until;
        this.cart.state = this.couponPass.state;
        this.cart.constraints = this.couponPass.constraints;
        this.cart.owner = this.couponPass.owner;
        this.cart.consumer = this.couponPass.consumer;
        this.cart.quantity = this.quantity;
        // console.log('id', this.cart.id);
        let crt = [];
        crt = cart;
        crt.push(this.cart);
        console.log('crt', crt);

        this.localStorage.setItem('cart', crt).subscribe(() => {
            this.inCart = true;
            this.addBreadcrumb();
            return;
          });

      }
      return;
    });
    // CartController.CheckCartCoupon(this.localStorage, coupon_id, this.quantity);
    this.modalRef.hide();

    this.toastCart();



  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }


  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef.hide();
    this.toastCart();

  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  toastCart() {
    this.toastr.success( 'Coupon added to cart!');
  }

  setQuantity(e) {
    console.log('e', e);
    if (!(Number(e) === NaN)) {
      console.log('e Number', e);
      this.quantity = e;
    }
  }

  viewCart() {
    this.router.navigate(['/reserved-area/consumer/cart']);

  }

  inCartFunction(id) {
    let value: boolean;
    this.localStorage.getItem<any>('cart').subscribe((cart) => {
      this.couponsCheckCart = cart;

      for (const i of this.couponsCheckCart) {
        if (id === i.id) {
          value = true;
          return true;
        }
      }
      value = false;
    });
    return value;
  }

}
