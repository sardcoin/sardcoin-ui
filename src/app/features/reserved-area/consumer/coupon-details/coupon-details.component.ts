import {Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {environment} from '../../../../../environments/environment';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {ToastrService} from 'ngx-toastr';
import {Coupon} from '../../../../shared/_models/Coupon';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../../shared/_services/user.service';
import {CartActions} from '../cart/redux-cart/cart.actions';
import {CartItem} from '../../../../shared/_models/CartItem';
import {GlobalEventsManagerService} from '../../../../shared/_services/global-event-manager.service';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {LoginState} from '../../../authentication/login/login.model';

@Component({
  selector: 'app-coupon-details',
  templateUrl: './coupon-details.component.html',
  styleUrls: ['./coupon-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
// TODO make details open to every other user type
export class CouponDetailsComponent implements OnInit, OnDestroy { // TODO check if user is logged in before make some calls

  @select() login$: Observable<LoginState>;

  imageURL = environment.protocol + '://' + environment.host + ':' + environment.port + '/';
  modalRef: BsModalRef;
  myForm: FormGroup;
  couponPass: Coupon = null;
  isMax = false;
  producer = null;
  desktopMode: boolean;
  classRow: string;
  classDiv: string;
  classMx4: string;

  error404: boolean = false;

  isUserLoggedIn: boolean;

  constructor(
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cartActions: CartActions,
    private globalEventService: GlobalEventsManagerService,
  ) {
  }

  async ngOnInit() {
    // If the user is already in coupon details and choose another coupon, then to change coupon there is to listen to the route change
    this.router.events.subscribe(async event => {
        if (event instanceof NavigationEnd) {
          await this.loadCoupon();
        }
      }
    );

    // this.globalEventService.isUserLoggedIn.subscribe(value => {
    //   this.isUserLoggedIn = value;
    // });

    this.login$.subscribe(login => {
      this.isUserLoggedIn = login['isLogged'];
    });

    await this.loadCoupon();
  }

  async loadCoupon() {
    const pathArray = this.route.snapshot.url[this.route.snapshot.url.length - 1].path.split('-');
    const title = pathArray.slice(1).toString().replace(new RegExp(',', 'g'), ' ');
    const id = parseInt(pathArray[0]);

    if (!isNaN(id)) {
      try {
        this.couponService.getCouponById(id);
        this.couponPass = await this.couponService.getCouponById(id).toPromise();

        // If a coupon with the passed ID does not exist, or the title has not been passed, or the title it is different from the real coupon, it returns 404
        if (this.couponPass === null || this.couponPass.title !== title || !title) {
          this.error404 = true;
        } else {

          if (!this.couponPass.max_quantity && this.isUserLoggedIn) {
            this.couponPass.max_quantity = await this.cartActions.getQuantityAvailableForUser(this.couponPass.id);
          }

          this.globalEventService.desktopMode.subscribe(message => {
            this.desktopMode = message;
          });

          this.getOwner();
          this.addBreadcrumb();
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      this.error404 = true;
    }
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
      this.toastr.success('', this.couponPass.title + ' aggiunto al carrello.');
    } else {
      this.toastr.error(this.couponPass.title + ' non è stato aggiunto al carrello.', 'Coupon non aggiunto');
    }

    this.modalRef.hide();
    this.viewCart();
  }

  get f() {
    return this.myForm.controls;
  }

  openModal(template: TemplateRef<any>) {

    if (this.couponPass.max_quantity === 0) {
      this.toastr.error('Hai già raggiunto la quantità massima acquistabile per questo coupon o è esaurito.', 'Coupon non aggiunto');
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
    if (!this.isMax) {
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
    this.router.navigate(['/cart']);
  }

  formatPrice(price) {
    if (price === 0) {
      return 'Gratis';
    }

    return '€ ' + price.toFixed(2);
  }

  formatUntil(inputDate) {
    if (inputDate === null) {
      return 'senza scadenza';
    }

    const date = inputDate.toString().substring(0, inputDate.indexOf('T'));
    const time = inputDate.toString().substring(inputDate.indexOf('T') + 1, inputDate.indexOf('Z') - 4);

    return date + ' ' + time;
  }

  retry() {
    let arrayUrl = this.router.url.slice(1).split('/');
    let url = arrayUrl.includes('reserved-area') ? arrayUrl[0] + '/' + arrayUrl[1] : '';
    this.router.navigate([url + '/showcase']);
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Shopping', '/showcase'));
    bread.push(new Breadcrumb(this.couponPass.title, '/bought/myPurchases'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  setClass() {
    this.classRow = 'row';
    this.classDiv = 'col-md-8 offset-md-2';
    this.classMx4 = 'card mx-4';

  }
}
