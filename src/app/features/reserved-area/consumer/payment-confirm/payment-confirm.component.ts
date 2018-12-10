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
import {CartItem} from '../../../../shared/_models/CartItem';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-confirm.component.html',
  styleUrls: ['./payment-confirm.component.scss']
})
export class PaymentConfirmComponent implements OnInit, OnDestroy { // TODO rename in CHECKOUT


  cartArray: any;
  user: any;
  modalRef: BsModalRef;
  bread = [] as Breadcrumb[];
  totalAmount = 0;
  arrayTitle = [];
  availableCoupons: any;


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
    this.userService.getUserById().subscribe(user => {
      this.user = user;
      this.getAvailableCoupons();
    });

  }

  ngOnInit() {
    this.addBreadcrumb();
    this.localStorage.getItem('cart').subscribe(cart => {
      this.cartArray = cart;
      for (const i of this.cartArray) {
        this.totalAmount += Number(i.price);
        this.arrayTitle.push(i.title);
      }
    });
    this.userService.getUserById().subscribe(user => {
      this.user = user;
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
    this.bread.push(new Breadcrumb('Checkout', '/reserved-area/consumer/checkout'));

    this.breadcrumbActions.updateBreadcrumb(this.bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});

  }

  buy(cartArray) {

    let quantityBuy = 0;

    /*    for (const i of cartArray) { // For each element in the cart
          for (const j of this.availableCoupons) { // For each coupon available
            if (i.title === j.title) { // If they got the same title
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
        } */

    console.log(cartArray);

    const cartArr: CartItem[] = [];

    cartArr.push({id: 15, quantity: 1});
    // cartArr.push({id: 42, quantity: 2});

    // const cartArr2: CartItem[] = [];

    // cartArr2.push({id: 15, quantity: 1});
    // cartArr2.push({id: 42, quantity: 1});

    // console.log(cartArr2);

    // this.couponService.buyCoupons(cartArr)
    //   .subscribe(response => {
    //     console.log(response);
    //   }, err => {
    //     console.log(err);
    //   });

/*
    this.couponService.buyCoupons(cartArr2)
      .subscribe(response => {
        console.log(response);
      }, err => {
        console.log(err);
      });
*/



    // this.toastBuy();
    this.decline();
  }

  decline() {
    this.modalRef.hide();

  }

  retry() {
    this.router.navigate(['/reserved-area/consumer/cart']);

  }

  getAvailableCoupons() {
    this.couponService.getAvailableCoupons().subscribe(
      data => {
        this.availableCoupons = data;
      });
  }

  toastBuy() {
    this.toastr.success('Your purchase has successfully completed', 'Congratulations!');

  }

}
