import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';
import {CouponService} from '../../../../../shared/_services/coupon.service';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {CartController} from '../cart-controller';
import {Breadcrumb} from '../../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../../core/breadcrumb/breadcrumb.actions';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-cart-show',
  templateUrl: './cart-show.component.html',
  styleUrls: ['./cart-show.component.scss']
})
export class CartShowComponent implements OnInit, OnDestroy {


  couponArray: any;
  couponCart: any;
  cartArray =  [];
  modalRef: BsModalRef;
  getDistinctAvailables: any;
  getAffordables: any;

  isEmpty: boolean;
  message: string;
  bread = [] as Breadcrumb[];


  constructor(private _sanitizer: DomSanitizer,
              private couponService: CouponService,
              private localStorage: LocalStorage,
              private modalService: BsModalService,
              private router: Router,
              private toastr: ToastrService,
              private breadcrumbActions: BreadcrumbActions,

  ) {this.returnGetDistinctAvailables();
    this.returnGetAffordables();
     }

  ngOnInit() {
    this.addBreadcrumb();
    this.control();

  }
  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  imageUrl(path) {
    // let subs = path.substr(path.lastIndexOf('\\')+1);
    // return correct address and port backend plus name image
    return this._sanitizer.bypassSecurityTrustUrl('http://' + environment.host + ':' + environment.port + '/' + path);
  }

  formatPrice(price) {
    if (price === 0) {
      return 'Free';
    }

    return '€ ' + price.toFixed(2);
  }

  returnGetDistinctAvailables() {
    this.couponService.getDistinctAvailables().subscribe(
      data => {
        this.getDistinctAvailables = data;
        // console.log('distinct', this.getDistinctAvailables);
      });
  }

  returnGetAffordables() {
    this.couponService.getAffordables().subscribe(
      data => {
        this.getAffordables = data;
        // console.log('affordables', this.getAffordables  );
      });
  }

  control() {

    this.couponService.getDistinctAvailables().subscribe(
      data => {
        this.couponArray = data;

        this.localStorage.getItem('cart').subscribe((crt) => {

          this.couponCart = crt;
           // console.log('crt', crt);
          if (crt === null || crt.length === 0) {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
          }
          for (let i = 0 ; i < this.couponCart.length; i++) {
            for (let j = 0 ; j < this.couponArray.length; j++) {
              if (this.couponCart[i].title === this.couponArray[j].title) {
                this.couponArray[j].quantity = this.couponCart[i].quantity;
                this.cartArray.push(this.couponArray[j]);
              }
            }
          }
          // console.log('cart with complete data', this.cartArray);
        });
      },
      error => console.log(error)
    );

  }
  formatState(state) {
    /*    switch (state) {
          case 0:
            return 'Active';
          default:
            return 'unknown';
        }*/
    return 'Active';
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


  buy(cartArray) {

    for (const i of cartArray) {
      let quantityBuy = 0;
      for (const j of this.getAffordables) {
        if (i.title === j.title) {
          if (quantityBuy < i.quantity) {
            quantityBuy++;
            this.couponService.buyCoupon(j.id)
              .subscribe(data => {
                this.localStorage.setItem('cart', []).subscribe(() => {
                  this.addBreadcrumb();
                  this.router.navigate(['/reserved-area/consumer/bought']);
                });


              }, err => {
                console.log(err);
              });
          }
        }
      }
    }

    this.addBreadcrumb();
    this.toastBuy();
    this.isEmpty = true;
    this.decline();
  }
  decline(): void {
    this.modalRef.hide();
  }

  details(coupon: any) {
    this.couponService.setCoupon(coupon);

    this.router.navigate(['/reserved-area/consumer/details']);
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }



  toastBuy() {
    this.toastr.success( 'Purchase successfully completed');

  }

  onDelete(id: number) {
    const arr = [];
    for (const i  of  this.couponCart ) {
      if (i.id !== id) {
        arr.push(i);
      }
      this.couponCart = arr;
    }

    if (this.couponCart.length === 0) {
      this.isEmpty = true;
    }
    this.localStorage.setItem('cart', arr ).subscribe(() => {
      this.cartArray = [];
      for (let i = 0 ; i < this.couponCart.length; i++) {
        for (let j = 0 ; j < this.couponArray.length; j++) {
          if (this.couponCart[i].id === this.couponArray[j].id) {
            this.couponArray[j].quantity = this.couponCart[i].quantity;
            this.cartArray.push(this.couponArray[j]);
          }
        }
      }
      if (arr.length === 0) {
        this.localStorage.removeItem('cart').subscribe();
      }

      this.addBreadcrumb();
      // console.log('cart with complete data', this.cartArray);
    });
    this.modalRef.hide();

  }
  del(coupon) {
    const arr = [];
    for (const i  of  this.couponCart ) {
      if (i.id !== coupon.id) {
        arr.push(i);
      } else {
        const qty = (Number(coupon.quantity) - 1);
        const item = {id: coupon.id, quantity: qty};

        arr.push(item);
      }
      this.couponCart = arr;
    }

    this.localStorage.setItem('cart', arr ).subscribe(() => {
      this.cartArray = [];
      for (let i = 0 ; i < this.couponCart.length; i++) {
        for (let j = 0 ; j < this.couponArray.length; j++) {
          if (this.couponCart[i].id === this.couponArray[j].id) {
            this.couponArray[j].quantity = this.couponCart[i].quantity;
            this.cartArray.push(this.couponArray[j]);
          }
        }
      }
      // console.log('del quantity', this.cartArray);
    });

  }
  add(coupon) {


    const arr = [];
    for (const i  of  this.couponCart ) {
      if (i.id !== coupon.id) {
        arr.push(i);
      } else {
        const qty = (Number(coupon.quantity) + 1);
        const item = {id: coupon.id, quantity: qty};
        arr.push(item);
      }
      this.couponCart = arr;
    }

    this.localStorage.setItem('cart', arr ).subscribe(() => {
      this.cartArray = [];
      for (let i = 0 ; i < this.couponCart.length; i++) {
        for (let j = 0 ; j < this.couponArray.length; j++) {
          if (this.couponCart[i].id === this.couponArray[j].id) {
            this.couponArray[j].quantity = this.couponCart[i].quantity;
            this.cartArray.push(this.couponArray[j]);
          }
        }
      }
      // console.log('del quantity', this.cartArray);
    });

  }
  maximumQuantity(id) {

    for (const i of this.getDistinctAvailables) {
      if (id !== i.id) {
        continue;
      } else {
        // console.log('true');
        // console.log('quantity', i.quantity);
        return Number(Number(i.quantity));
      }
    }


  }

  retry() {
    this.router.navigate(['/reserved-area/consumer/showcase']);
  }
  openBought() {
    this.router.navigate(['/reserved-area/consumer/bought']);
  }

  goToDetailPayment(cartArray) {
    this.localStorage.setItem('cart', cartArray ).subscribe(() => {
      this.router.navigate(['/reserved-area/consumer/cart-detail-payment']);
      this.decline();

    });
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
