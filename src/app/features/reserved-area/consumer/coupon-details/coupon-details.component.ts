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
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-coupon-details',
  templateUrl: './coupon-details.component.html',
  styleUrls: ['./coupon-details.component.scss']
})

export class CouponDetailsComponent implements OnInit, OnDestroy {
  URLstring = 'http://' + environment.host + ':' + environment.port + '/';
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
    private formBuilder: FormBuilder
  ) {


  }

  ngOnInit() {


    this.couponService.currentMessage.subscribe(coupon => {
      this.couponPass = coupon;


      if (this.couponPass === null) {
        this.router.navigate(['/reserved-area/consumer/showcase']);
        // this.addBreadcrumb();
         } else {

        this.couponService.getPurchasedCoupons().subscribe(cp => {

          let count = 0;
          this.couponArray = cp;
          console.log('this.couponArray', this.couponArray);
          for ( let i = 0;  i < this.couponArray.length; i++) {
            console.log('i.title', this.couponArray[i].title);
            console.log('i.description', this.couponArray[i].description);
            console.log('i.price', this.couponArray[i].price);

            if ((this.couponArray[i].title === this.couponPass.title)
              && (this.couponArray[i].description === this.couponPass.description) &&
              Number(this.couponArray[i].price) === Number(this.couponPass.price)) {
              console.log('i.title', this.couponArray[i].title);
              console.log('i.description', this.couponArray[i].description);
              console.log('i.price', this.couponArray[i].price);

              count++;
            }

          }
          console.log('quantity', this.couponPass.purchasable);
          console.log('couponPass', this.couponPass);
          console.log('count', count);

          this.maxQuantity = this.maxQuantityAvaliableForUser(this.couponPass.quantity,
                                                    count, this.couponPass.purchasable);



        this.getOwner();
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
      // console.log('quantity invalid');
      // console.log(this.tokenForm);
      return;

    }
      this.cart.id = this.couponPass.id;
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
      this.cart.quantity = this.myForm.value.quantity;
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
        // console.log('id', this.cart.id);
        crt = cart;
        crt.push(this.cart);
        // console.log('crt', crt);
        this.localStorage.setItem('cart', crt).subscribe(() => {
            this.inCart = true;
            this.addBreadcrumb();
            return;
          });

      }
      return;
    });
    this.isMax = false;
    this.modalRef.hide();

    this.toastCart();



  }

  get f() {
    return this.myForm.controls;
  }


  openModal(template: TemplateRef<any>, quantity) {




      if (this.maxQuantity < 1) {
        this.toastExcesBuy();
        return;
      }

      this.myForm = this.formBuilder.group({
        quantity: [ 1 , Validators.compose([Validators.min(1), Validators.max(this.maxQuantity), Validators.required ])]

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
    this.toastr.success( 'Coupon added to cart!');
  }

  toastExcesBuy() {
    this.toastr.error( 'Coupon exceded to buy!');

  }

  setQuantity(e) {
    // console.log('e', e);
    if (!(Number(e) === NaN)) {
      // console.log('e Number', e);
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

  getOwner() {
    this.couponService.getProducerFromId(this.couponPass.owner).subscribe(user => {
      console.log('user', user);
      this.producer = user;
      this.couponService.setUserCoupon(this.producer);

    });
  }

  add() {
    this.myForm.controls.quantity.setValue((this.myForm.value.quantity + 1));
    if ( this.myForm.value.quantity === this.maxQuantity) {
      this.isMax = true;
    }
  }

  del() {

    this.myForm.controls.quantity.setValue((this.myForm.value.quantity - 1));
    this.isMax = false;
  }


  maxQuantityAvaliableForUser(dispTotal, buyedUser, limitUser) {
    let max = 0;
    this.availability = dispTotal;
    if (dispTotal > limitUser) {
      max = limitUser - buyedUser;
    } else if ( (limitUser - buyedUser) < dispTotal ) {

      max = dispTotal - buyedUser;
    } else {
      max = dispTotal;
    }

    return max;
  }


}
