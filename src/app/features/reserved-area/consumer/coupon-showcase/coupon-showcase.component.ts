import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {DomSanitizer} from '@angular/platform-browser';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CartItem} from '../../../../shared/_models/CartItem';
import {StoreService} from '../../../../shared/_services/store.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import {Coupon} from '../../../../shared/_models/Coupon';


@Component({
  selector: 'app-feature-reserved-area-consumer-showcase',
  templateUrl: './coupon-showcase.component.html',
  styleUrls: ['./coupon-showcase.component.scss']
})
export class FeatureReservedAreaConsumerShowcaseComponent implements OnInit, OnDestroy {

  coupons: any;
  couponsCheckCart = [];
  modalRef: BsModalRef;
  cart = new CartItem();
  crt = [];
  quantity = 1;
  maxQuantity = 1;
  isMax = false;
  bread = [] as Breadcrumb[];
  value: any;
  myForm: FormGroup;
  couponArray: any;


  constructor(private couponService: CouponService,
              private breadcrumbActions: BreadcrumbActions,
              private _sanitizer: DomSanitizer,
              private modalService: BsModalService,
              private localStore: StoreService,
              private router: Router,
              private toastr: ToastrService,
              protected localStorage: LocalStorage,
              private formBuilder: FormBuilder) {

        this.localStorage.getItem('cart').subscribe(cart => {
          if (cart === null) {
            this.localStorage.setItem('cart', []);
          }
        });

  }

  ngOnInit(): void {
    this.loadCoupons();
    this.addBreadcrumb();


  }
  get f() {
    return this.myForm.controls;
  }


  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  addBreadcrumb() {
    this.bread = [] as Breadcrumb[];

    this.bread.push(new Breadcrumb('Home', '/'));
    this.bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    this.bread.push(new Breadcrumb('Consumer', '/reserved-area/consumer/'));
    this.bread.push(new Breadcrumb('Shopping', '/reserved-area/consumer/showcase'));

    this.breadcrumbActions.updateBreadcrumb(this.bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  loadCoupons() {
    this.couponService.getDistinctAvailables()
      .subscribe(coupons => {
        this.coupons = coupons;
        // console.log('getDistinctAvailables', coupons);
        this.localStorage.getItem('cart').subscribe(cart => {
          if (cart === null) {
            this.coupons = coupons;
          } else {
            let getCart = [];
            getCart = cart;
            for (let i = 0; i < getCart.length; i++) {
              for (const j of this.coupons) {
                // console.log('j[1]', j.id);
               if (getCart[i].title === j.title) {
                  this.couponsCheckCart.push(j);
                 this.coupons = coupons;
               }
              }
            }
          }
          this.addBreadcrumb();
        });
        // this.coupons = coupons;
      }, err => {
        console.log(err);
      });
  }

  imageUrl(path) {
    return this._sanitizer.bypassSecurityTrustUrl('http://' + environment.host + ':' + environment.port + '/' + path);
  }

  formatPrice(price) {
    if (price === 0) {
      return 'Free';
    }

    return '€ ' + price.toFixed(2);
  }

  openModal(template: TemplateRef<any>, cp) {
    this.couponService.getPurchasedCoupons().subscribe(coupon => {

      let count = 0;
      this.couponArray = coupon;
      // console.log('this.couponArray', this.couponArray);
      for (let i = 0; i < this.couponArray.length; i++) {
        if ((this.couponArray[i].title === cp.title)
          && (this.couponArray[i].description === cp.description) &&
          Number(this.couponArray[i].price) === Number(cp.price)) {
          // console.log('i.title', this.couponArray[i].title);
          // console.log('i.description', this.couponArray[i].description);
          // console.log('i.price', this.couponArray[i].price);

          count++;
        }

      }
      // console.log('purchasable', cp.purchasable);
      // console.log('couponPass', cp);
      // console.log('count', count);
      // console.log('quantity', cp.quantity);



        this.maxQuantity = this.maxQuantityAvaliableForUser(cp.quantity, count, cp.purchasable);

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
    });
    }

  toastExcesBuy() {
    this.toastr.error( 'Coupon exceded to buy!');

  }

  decline(): void {
    this.isMax = false;
    this.modalRef.hide();
  }

  details(coupon: any) {

    this.couponService.setCoupon(coupon);

    this.router.navigate(['/reserved-area/consumer/details']);
  }

  toastCart() {
    this.toastr.success( 'Coupon added to cart!');
  }


  addToCart(coupon: Coupon) {

    // console.log('quantity invalid', this.myForm.invalid);

    if (this.myForm.invalid) {
      // console.log('quantity invalid');
      // console.log(this.tokenForm);
      return;

    }
    const cpn = new Coupon();
    cpn.quantity = this.myForm.value.quantity;
    cpn.id = coupon.id;
    cpn.title = coupon.title;
    cpn.description = coupon.description;
    cpn.image = coupon.image;
    cpn.timestamp = coupon.timestamp;
    cpn.price = coupon.price;
    cpn.valid_from = coupon.valid_from;
    cpn.valid_until = coupon.valid_until;
    cpn.state = coupon.state;
    cpn.constraints = coupon.constraints;
    cpn.owner = coupon.owner;
    cpn.consumer = coupon.consumer;
    this.localStorage.getItem<any>('cart').subscribe((cart) => {
        if (cart === null) {
          this.localStorage.setItem('cart', [cpn]).subscribe(() => {
            this.loadCoupons();
            return;
          });
        } else {
            this.crt = cart;
              this.crt.push(cpn);
            this.localStorage.setItem('cart', this.crt).subscribe(() => {this.loadCoupons(); });

        }

        // console.log('cpn', cpn);
    });
    this.isMax = false;
    this.modalRef.hide();

    this.toastCart();


  }

  inCart(coupon) {

    for (const i of this.couponsCheckCart) {
      if (coupon.title === i.title) {
        return true;
      }
    }
    return false;

  }
  viewCart() {
    this.router.navigate(['/reserved-area/consumer/cart']);

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

    if (dispTotal > limitUser) {
      max = limitUser - buyedUser;
    }
    if (dispTotal <= limitUser) {
      if (limitUser - buyedUser  >= dispTotal) {
        max = dispTotal ;
      } else {
        max = limitUser - buyedUser;
      }
    }
    return max;
  }
}
