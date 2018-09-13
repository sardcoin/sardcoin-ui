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
  message: string;
  bread = [] as Breadcrumb[];


  constructor(private _sanitizer: DomSanitizer,
              private couponService: CouponService,
              private localStorage: LocalStorage,
              private modalService: BsModalService,
              private router: Router,
              private toastr: ToastrService,
              private breadcrumbActions: BreadcrumbActions,

  ) { }

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

  control() {

    this.couponService.getAffordables().subscribe(
      data => {
        this.couponArray = data;
        console.log(data);

        CartController.GetCartSimple(this.localStorage).subscribe((crt) => {

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
}
