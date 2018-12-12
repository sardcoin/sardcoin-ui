import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {StoreService} from '../../../../shared/_services/store.service';
import {Coupon} from '../../../../shared/_models/Coupon';

@Component({
  selector: 'app-consumer-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  couponArray: any;
  couponCart: any;
  cartArray = [];
  modalRef: BsModalRef;
  isEmpty: boolean;
  bread = [] as Breadcrumb[];

  constructor(
    private _sanitizer: DomSanitizer,
    private couponService: CouponService,
    private localStorage: StoreService,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService,
    private breadcrumbActions: BreadcrumbActions,
  ) {
  }

  ngOnInit() {
    this.addBreadcrumb();
    this.control();
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  imageUrl(path) {
    return this._sanitizer.bypassSecurityTrustUrl(environment.protocol + '://' + environment.host + ':' + environment.port + '/' + path);
  }

  formatPrice(price) {
    if (price === 0) {
      return 'Free';
    }

    return '€ ' + price.toFixed(2);
  }

  control() {
    /*    this.couponService.getAvailableCoupons().subscribe(data => {
            this.couponArray = data;

            this.localStorage.getItem('cart').subscribe((crt) => {

              this.couponCart = crt;

              if (crt === null || crt.length === 0) {
                this.isEmpty = true;
              } else {
                this.isEmpty = false;
              }
              if (this.couponCart != null || this.couponCart !== undefined) {
                for (let i = 0; i < this.couponCart.length; i++) {
                  for (let j = 0; j < this.couponArray.length; j++) {
                    if (this.couponCart[i].id === this.couponArray[j].id) {
                      this.couponArray[j].quantity = this.couponCart[i].quantity;
                      this.cartArray.push(this.couponArray[j]);
                    }
                  }
                }
              }
            });
          },
          error => console.log(error)
        );

    this.localStorage.getCart().subscribe(crt => {  TODO fix
      this.cartArray = crt;
      this.isEmpty = this.cartArray === null || this.cartArray.length === 0;
    });
   */
  }

  addBreadcrumb() {
    this.bread = [] as Breadcrumb[];

    this.bread.push(new Breadcrumb('Home', '/'));
    this.bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    this.bread.push(new Breadcrumb('Consumer', '/reserved-area/consumer/'));
    this.bread.push(new Breadcrumb('Cart', '/reserved-area/consumer/cart'));

    this.breadcrumbActions.updateBreadcrumb(this.bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  closeModal(): void {
    this.modalRef.hide();
  }

  details(coupon: Coupon) {
    this.couponService.setCoupon(coupon);
    this.router.navigate(['/reserved-area/consumer/details']);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }


  toastBuy() {
    this.toastr.success('Purchase successfully completed');
  }

  onDelete(id: number) {
        const arr = [];
        for (const i  of  this.cartArray) {
          if (i.id !== id) {
            arr.push(i);
          }
          this.cartArray = arr;
        }

        if (this.cartArray.length === 0) {
          this.isEmpty = true;
        }
        /*this.localStorage.setCart(arr).subscribe(() => { TODO fix
          this.cartArray = [];
          for (let i = 0; i < this.couponCart.length; i++) {
            for (let j = 0; j < this.couponArray.length; j++) {
              if (this.couponCart[i].id === this.couponArray[j].id) {
                this.couponArray[j].quantity = this.couponCart[i].quantity;
                this.cartArray.push(this.couponArray[j]);
              }
            }
          }

          this.breadcrumbActions.updateCartLength(this.cartArray.length);

          if (arr.length === 0) {
            this.localStorage.removeCart().subscribe();
          }
        });*/
        this.modalRef.hide();

  }

  del(coupon: Coupon) {
        const arr = [];
        for (const i  of  this.cartArray) {
          if (i.id !== coupon.id) {
            arr.push(i);
          } else {
            const qty = (Number(coupon.quantity) - 1);
            // const item = {id: coupon.id, quantity: qty};
            i.quantity = qty;
            arr.push(i);
          }
          this.cartArray = arr;
        }

/*        this.localStorage.setCart(this.cartArray).subscribe(() => { TODO fix
          this.cartArray = [];
          for (let i = 0; i < this.couponCart.length; i++) {
            for (let j = 0; j < this.couponArray.length; j++) {
              if (this.couponCart[i].id === this.couponArray[j].id) {
                this.couponArray[j].quantity = this.couponCart[i].quantity;
                this.cartArray.push(this.couponArray[j]);
              }
            }
          }
        });*/
  }

  add(coupon: Coupon) {


    /*    const arr = [];
        for (const i  of  this.couponCart) {
          if (i.id !== coupon.id) {
            arr.push(i);
          } else {
            const qty = (Number(coupon.quantity) + 1);
            i.quantity = qty;
            arr.push(i);
          }
          this.couponCart = arr;
        }

        this.localStorage.setItem('cart', this.couponCart).subscribe(() => {
          this.cartArray = [];
          for (let i = 0; i < this.couponCart.length; i++) {
            for (let j = 0; j < this.couponArray.length; j++) {
              if (this.couponCart[i].id === this.couponArray[j].id) {
                this.couponArray[j].quantity = this.couponCart[i].quantity;
                this.cartArray.push(this.couponArray[j]);
              }
            }
          }
        });*/

    this.breadcrumbActions.updateCartLength(this.cartArray.length);
  }

  maximumQuantity(id) {
    return Number(Number(id.purchasable));
  }

  retry() {
    this.router.navigate(['/reserved-area/consumer/showcase']);
  }

  openBought() {
    this.router.navigate(['/reserved-area/consumer/bought']);
  }

  goToDetailPayment(cartArray) {
    // this.localStorage.setCart(cartArray).subscribe(() => {}); TODO fix
    this.closeModal();
    this.router.navigate(['/reserved-area/consumer/checkout']);
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
}
