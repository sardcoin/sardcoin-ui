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
  bread = [] as Breadcrumb[];
  value: any;
  myForm: FormGroup;



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

  // onChanges(): void {
  //
  //   const value = this.maxQuantity;
  //   // console.log('maxquantity', this.maxQuantity);
  //   const insert = this.value;
  //   this.myForm.valueChanges.subscribe(val => {
  //
  //     const val_quantity = val.quantity;
  //     val.quantity = this.setQuantity(val.quantity);
  //      // console.log('val', val.quantity);
  //     this.refreshQuantity = val.quantity;
  //     // if (val.quantity >= this.quantity ) {
  //     //   this.refreshQuantity = this.quantity;
  //     // } else if (val.quantity < 1) {
  //     //   this.refreshQuantity = 1;
  //     // } else {
  //     //   this.refreshQuantity = val.quantity;
  //     // }
  //     //
  //
  //
  //     // console.log('refreshQuantity', this.refreshQuantity);
  //     // console.log('value', value);
  //     // console.log('insert', insert);
  //
  //
  //   });
  // }

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

  // buyCoupon(coupon_id: number) {
  //
  //   console.log('quantity invalid', this.myForm.invalid);
  //
  //   if (this.myForm.invalid) {
  //     console.log('quantity invalid');
  //     // console.log(this.couponForm);
  //     return;
  //
  //   }
  //   this.couponService.buyCoupon(coupon_id)
  //     .subscribe(data => {
  //
  //       this.router.navigate(['/reserved-area/consumer/bought']);
  //       this.toastCart();
  //
  //     }, err => {
  //       console.log(err);
  //     });
  //
  //   this.decline();
  // }

  openModal(template: TemplateRef<any>, quantity) {
    this.maxQuantity = quantity;
    this.myForm = this.formBuilder.group({
      quantity: [ 1 , Validators.compose([Validators.min(1), Validators.max(this.maxQuantity), Validators.required ])]

    });

    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }

  decline(): void {
    this.modalRef.hide();
  }

  details(coupon: any, quantity) {
    const cp = coupon;
    cp.quantity = quantity;
    console.log('cp', cp);
    this.couponService.setCoupon(cp);

    this.router.navigate(['/reserved-area/consumer/details']);
  }

  toastCart() {
    this.toastr.success('Coupon in the cart', 'Coupon into to cart!');
  }


  addToCart(coupon: Coupon) {

    console.log('quantity invalid', this.myForm.invalid);

    if (this.myForm.invalid) {
      console.log('quantity invalid');
      // console.log(this.couponForm);
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

        console.log('cpn', cpn);
    });
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
}
