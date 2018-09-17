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
  getAffordables: any;
  message: string;
  bread = [] as Breadcrumb[];


  constructor(private _sanitizer: DomSanitizer,
              private couponService: CouponService,
              private localStorage: LocalStorage,
              private modalService: BsModalService,
              private router: Router,
              private toastr: ToastrService,
              private breadcrumbActions: BreadcrumbActions,

  ) {this.returnGetAffordables(); }

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

  returnGetAffordables() {
    this.couponService.getAffordables().subscribe(
      data => {
        this.getAffordables = data;
        console.log('aff', this.getAffordables);
      });
  }

  control() {

    this.couponService.getAffordables().subscribe(
      data => {
        this.couponArray = data;

        this.localStorage.getItem('cart').subscribe((crt) => {

          this.couponCart = crt;
          for (let i = 0 ; i < this.couponCart.length; i++) {
            for (let j = 0 ; j < this.couponArray.length; j++) {
              if (this.couponCart[i].id === this.couponArray[j].id) {
                this.couponArray[j].quantity = this.couponCart[i].quantity;
                this.cartArray.push(this.couponArray[j]);
              }
            }
          }
          console.log('cart with complete data', this.cartArray);
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
      this.couponService.buyCoupon(i.id)
        .subscribe(data => {
          this.localStorage.setItem('cart', []).subscribe( () => {
            this.addBreadcrumb();
            this.router.navigate(['/reserved-area/consumer/bought']);
          });


        }, err => {
          console.log(err);
        });
    }
    this.addBreadcrumb();
    this.toastBuy();
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
    this.toastr.success('Bought coupon', 'Coupon bought successfully');

  }

  onDelete(id: number) {
    const arr = [];
    for (const i  of  this.couponCart ) {
      if (i.id !== id) {
        arr.push(i);
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
      this.addBreadcrumb();
      console.log('cart with complete data', this.cartArray);
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
      console.log('del quantity', this.cartArray);
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
      console.log('del quantity', this.cartArray);
    });

  }
  maximumQuantity(id) {

    for (const i of this.getAffordables) {
      if (id !== i.id) {
        continue;
      } else {
        console.log('true');
        console.log('quantity', i.quantity);
        return Number(Number(i.quantity));
      }
    }


  }
}
