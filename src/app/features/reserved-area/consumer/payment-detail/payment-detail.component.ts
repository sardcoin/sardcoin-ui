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
import {HttpClient} from '@angular/common/http';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss']
})
export class PaymentDetailComponent implements OnInit, OnDestroy {


  cartArray: any;
  user: any;
  modalRef: BsModalRef;
  bread = [] as Breadcrumb[];
  totalAmount = 0;
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

    this.cartArray = this.localStorage.getItem('cart');
    // console.log('cartArray', this.cartArray);
    this.cartArray = this.localStorage.getItem('cart');
    this.userService.getUserById().subscribe( user => { this.user = user;
      this.returnGetAffordables();
      });

  }

  ngOnInit() {
    this.addBreadcrumb();
    this.localStorage.getItem('cart').subscribe(cart => {
      this.cartArray = cart;
      // console.log('cartArray', this.cartArray);
      for (const i of this.cartArray) {
          this.totalAmount += Number(i.price);
          this.arrayTitle.push(i.title);
      }
    });
    this.userService.getUserById().subscribe( user => { this.user = user;
    // console.log('uuuuuuuuserrrr', this.user);
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
        if (i.title === j.title) {
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
    this.couponService.getAffordables().subscribe(
      data => {
        this.getAffordables = data;
        // console.log('affordables', this.getAffordables  );
      });
  }

  toastBuy() {
    this.toastr.success('Bought coupons', 'Coupons bought successfully');

  }

}
