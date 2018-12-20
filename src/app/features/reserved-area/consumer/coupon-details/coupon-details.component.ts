import {Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {environment} from '../../../../../environments/environment';
import {Router} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {ToastrService} from 'ngx-toastr';
import {Coupon} from '../../../../shared/_models/Coupon';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../../shared/_services/user.service';
import {CartActions} from '../cart/redux-cart/cart.actions';
import {CartItem} from '../../../../shared/_models/CartItem';

@Component({
  selector: 'app-coupon-details',
  templateUrl: './coupon-details.component.html',
  styleUrls: ['./coupon-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CouponDetailsComponent implements OnInit, OnDestroy {
  imageURL = environment.protocol + '://' + environment.host + ':' + environment.port + '/';
  modalRef: BsModalRef;
  myForm: FormGroup;
  couponPass: Coupon;
  isMax = false;
  producer = null;

  constructor(
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cartActions: CartActions
  ) {

  }

  async ngOnInit() {
    this.couponService.currentMessage.subscribe(async coupon => {
      this.couponPass = coupon;

      if (this.couponPass === null) {
        this.router.navigate(['/reserved-area/consumer/showcase']);
      } else {

        if(!this.couponPass.max_quantity) {
          this.couponPass.max_quantity = await this.cartActions.getQuantityAvailableForUser(this.couponPass.id);
        }

        this.getOwner();
        this.addBreadcrumb();
      }
    });
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  async addToCart() {
    if (this.myForm.invalid) {
      return;
    }

    const item: CartItem = {
      id: this.couponPass.id,
      quantity: this.myForm.value.quantity
    };

    if (await this.cartActions.addElement(item)) {
      this.toastr.success('', this.couponPass.title + ' successfully added to the cart.');
    } else {
      this.toastr.error(this.couponPass.title + ' cannot be added to the cart.', 'Error adding the coupon');
    }

    this.modalRef.hide();
    this.viewCart();
  }

  get f() {
    return this.myForm.controls;
  }

  openModal(template: TemplateRef<any>) {

    if (this.couponPass.max_quantity === 0) {
      this.toastr.error('You either have already reached the maximum quantity purchasable for this coupon or it is out of stock.', 'Cannot add the coupon');
      return;
    }

    this.myForm = this.formBuilder.group({
      quantity: [1, Validators.compose([Validators.min(1), Validators.max(this.couponPass.max_quantity), Validators.required])]

    });

    this.isMax = this.myForm.value.quantity === this.couponPass.max_quantity;
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }

  inCart(coupon_id: number) {
    return this.cartActions.isInCart(coupon_id) >= 0; // If true, the element exists and its index is been retrievd
  }

  add() {
    if(!this.isMax) {
      this.myForm.controls.quantity.setValue((this.myForm.value.quantity + 1));
      this.isMax = this.myForm.value.quantity === this.couponPass.max_quantity;
    }
  }

  del() {
    this.myForm.controls.quantity.setValue((this.myForm.value.quantity - 1));
    this.isMax = false;
  }

  closeModal() {
    this.modalRef.hide();
  }

  getOwner() {
    this.userService.getProducerFromId(this.couponPass.owner).subscribe(user => {
      this.producer = user;
      this.couponService.setUserCoupon(this.producer);
    });
  }

  viewCart() {
    this.router.navigate(['/reserved-area/consumer/cart']);
  }

  formatPrice(price) {
    if (price === 0) {
      return 'Free';
    }

    return '€ ' + price.toFixed(2);
  }

  formatUntil(inputDate) {
    if (inputDate === null) {
      return 'Unlimited';
    }

    const date = inputDate.toString().substring(0, inputDate.indexOf('T'));
    const time = inputDate.toString().substring(inputDate.indexOf('T') + 1, inputDate.indexOf('Z') - 4);

    return date + ' ' + time;
  }

  retry() {
    this.router.navigate(['/reserved-area/consumer/showcase']);
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    // bread.push(new Breadcrumb('Home', '/'));
    // bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Home', '/reserved-area/consumer/'));
    bread.push(new Breadcrumb(this.couponPass.title + ' details', '/reserved-area/consumer/showcase'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }
}
