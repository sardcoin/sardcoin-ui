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
import {Coupon} from '../../../../shared/_models/Coupon';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../../shared/_services/user.service';

@Component({
  selector: 'app-coupon-details',
  templateUrl: './coupon-details.component.html',
  styleUrls: ['./coupon-details.component.scss']
})

export class CouponDetailsComponent implements OnInit, OnDestroy {
  URLstring = environment.protocol + '://' + environment.host + ':' + environment.port + '/';
  modalRef: BsModalRef;
  myForm: FormGroup;
  message: string;
  couponPass: any;
  cart = new Coupon();
  couponsPurchased: any;
  quantity = 1;
  isMax = false;
  couponsCheckCart: Coupon[];
  inCart = false;
  available = false;
  availability: number;
  producer = null;
  maxQuantity = 1;
  couponArray: any;


  constructor(
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    protected localStorage: LocalStorage,
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {


  }

  ngOnInit() { // TODO Fix details

/*
    this.couponService.currentMessage.subscribe(coupon => {
      this.couponPass = coupon;


      if (this.couponPass === null) {
        this.router.navigate(['/reserved-area/consumer/showcase']);
        // this.addBreadcrumb();
      } else {
        this.URLstring = this.URLstring + this.couponPass.image;

        this.couponService.getPurchasedCouponsById(this.couponPass.id).subscribe(cp => {

          let count = 0;
          /!*this.couponArray = cp;
          for (let i = 0; i < this.couponArray.length; i++) {

            if ((this.couponArray[i].id === this.couponPass.id)) {


              count = this.couponArray[i].CouponTokens.length;
            }

          }
*!/

          this.maxQuantity = this.maxQuantityAvaliableForUser(this.couponPass.quantity,
            cp.bought, this.couponPass.purchasable == null
              ? this.couponPass.quantity : this.couponPass.purchasable);
          this.getOwner();
          this.addBreadcrumb();

          this.couponService.getAvailableCoupons()
            .subscribe(coupons => {
              this.couponsPurchased = coupons;

              if (this.couponsPurchased !== null) {
                for (const i of this.couponsPurchased) {
                  if (this.couponPass.id === i.id) {
                    this.available = true;
                    this.availability = i.quantity;
                  }
                }
              }
              this.localStorage.getItem<any>('cart').subscribe((cart) => {
                this.couponsCheckCart = cart;

                if (this.couponsCheckCart !== null) {
                  for (const i of this.couponsCheckCart) {
                    if (this.couponPass.id === i.id) {
                      this.inCart = true;
                    }
                  }
                }
              });

            }, err => {
              console.log(err);
            });

        });
      }

    });*/
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Consumer', '/reserved-area/consumer/'));

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

    return this.formatFrom(until);
  }

  formatFrom(dataFrom) {
    const date = dataFrom.toString().substring(0, dataFrom.indexOf('T'));
    const time = dataFrom.toString().substring(dataFrom.indexOf('T') + 1, dataFrom.indexOf('Z'));
    return 'Date: ' + date + ' Time: ' + time;
  }

  retry() {

    this.removeBreadcrumb();
    this.router.navigate(['/reserved-area/consumer/showcase']);
  }

  addToCart(coupon: Coupon) {

    if (this.myForm.invalid) {
      return;
    }
    /*
    this.cart.id = this.couponPass.id;
    this.cart.title = this.couponPass.title;
    this.cart.description = this.couponPass.description;
    this.cart.image = this.couponPass.image;
    this.cart.timestamp = this.couponPass.timestamp;
    this.cart.price = this.couponPass.price;
    this.cart.valid_from = this.couponPass.valid_from;
    this.cart.valid_until = this.couponPass.valid_until;
    this.cart.visible_from = this.couponPass.visible_from;
    this.cart.constraints = this.couponPass.constraints;
    this.cart.owner = this.couponPass.owner;
    this.cart.quantity = this.myForm.value.quantity;
    this.cart.purchasable = this.maxQuantity;

    let crt = [];
    this.localStorage.getItem<any>('cart').subscribe((cart) => {
      this.couponsCheckCart = cart;
      if (cart === null) {
        crt.push(this.cart);
        this.localStorage.setItem('cart', crt).subscribe(() => {
          this.inCart = true;
          this.addBreadcrumb();
          return;
        });
      } else {
        crt = cart;
        crt.push(this.cart);
        this.localStorage.setItem('cart', crt).subscribe(() => {
          this.inCart = true;
          this.addBreadcrumb();
          return;
        });

      }
      return;
    });
    this.isMax = false;*/
    this.modalRef.hide();

    this.toastCart();
  }

  get f() {
    return this.myForm.controls;
  }


  openModal(template: TemplateRef<any>) {


    if (this.maxQuantity < 1) {
      this.toastExcesBuy();
      return;
    }

    this.myForm = this.formBuilder.group({
      quantity: [1, Validators.compose([Validators.min(1), Validators.max(this.maxQuantity), Validators.required])]

    });

    if (this.myForm.value.quantity === this.maxQuantity) {
      this.isMax = true;
    }
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});

  }


  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef.hide();
    this.toastCart();

  }

  decline(): void {
    this.isMax = false;
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  toastCart() {
    this.toastr.success('Coupon added to cart!');
  }

  toastExcesBuy() {
    this.toastr.error('Coupon exceded to buy!');

  }

  setQuantity(e) {
    if (!(Number(e) === NaN)) {
      this.quantity = e;
    }
  }

  viewCart() {
    this.router.navigate(['/reserved-area/consumer/cart']);

  }

  inCartFunction(id) {
    let value: boolean;
    value = true; // TODO Remove
    /*
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
    */
    return value;
  }

  getOwner() {
    this.userService.getProducerFromId(this.couponPass.owner).subscribe(user => {
      this.producer = user;
      this.couponService.setUserCoupon(this.producer);

    });
  }

  add() {
    this.myForm.controls.quantity.setValue((this.myForm.value.quantity + 1));
    if (this.myForm.value.quantity === this.maxQuantity) {
      this.isMax = true;
    }
  }

  del() {

    this.myForm.controls.quantity.setValue((this.myForm.value.quantity - 1));
    this.isMax = false;
  }


  maxQuantityAvaliableForUser(dispTotal, buyedUser, limitUser) {
    let max = 0;
    if (dispTotal > limitUser) {
      max = limitUser - buyedUser;
    }
    if (dispTotal <= limitUser) {
      if (limitUser - buyedUser >= dispTotal) {
        max = dispTotal;
      } else {
        max = limitUser - buyedUser;
      }
    }
    return max;
  }


}
