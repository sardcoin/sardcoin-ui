import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { environment } from '../../../../../../environments/environment';
import { Breadcrumb } from '../../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../../core/breadcrumb/breadcrumb.actions';
import { Coupon } from '../../../../../shared/_models/Coupon';
import { CouponService } from '../../../../../shared/_services/coupon.service';
import { GlobalEventsManagerService } from '../../../../../shared/_services/global-event-manager.service';
import { UserService } from '../../../../../shared/_services/user.service';

@Component({
  selector: 'app-coupon-bought-detail',
  templateUrl: './coupon-bought-detail.component.html',
  styleUrls: ['./coupon-bought-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CouponBoughtDetailComponent implements OnInit, OnDestroy { // TODO delete (redundant)
  imageURL = `${environment.protocol}://${environment.host}:${environment.port}/`;
  couponPass: Coupon = undefined;
  producer = undefined;
  desktopMode: boolean;
  classMx4: string;
  qrSize: number;

  modalRef: BsModalRef;

  constructor(
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService,
    private router: Router,
    private userService: UserService,
    private modalService: BsModalService,
    private globalEventService: GlobalEventsManagerService
  ) {
  }

  ngOnInit(): void {
    this.couponService.currentMessage.subscribe(coupon => {
      if (!coupon) {
        this.router.navigate(['/bought']);
      } else {
        console.warn(coupon);
        this.couponPass = coupon;
        this.couponPass.qrToken = coupon.token.token || coupon.token;

        this.addBreadcrumb();
        this.getOwner();
      }
      this.globalEventService.desktopMode.subscribe(message => {
        this.desktopMode = message;
        this.setClass();

      });
    });
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  addBreadcrumb = (): void => {
    const bread: Array<Breadcrumb> = [];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('I miei acquisti', '/bought/'));
    bread.push(new Breadcrumb(this.couponPass.title, '/bought/myPurchases'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  };

  removeBreadcrumb = (): void => {
    this.breadcrumbActions.deleteBreadcrumb();
  };

  formatPrice = (price: number): string =>
    price === 0 ? 'Gratis' : `€  ${price.toFixed(2)}`;

  formatUntil = (until): string =>
    until ? this.formatDate(until) : 'senza scadenza';

  formatDate = (inputDate): string => {
    const date = inputDate.toString()
      .substring(0, inputDate.indexOf('T'));
    const time = inputDate.toString()
      .substring(inputDate.indexOf('T') + 1, inputDate.indexOf('Z'));

    // return 'Data: ' + date + ' Ora: ' + time;
    return `Data: ${date} Ora: ${time}`;
  };

  retry = (): void => {
    this.router.navigate(['/bought']);
  };

  getOwner = (): void => {
    this.userService.getProducerFromId(this.couponPass.owner)
      .subscribe(user => {
        this.producer = user;
        this.couponService.setUserCoupon(this.producer);
      });
  };

  setClass = (): void => {
    if (!this.desktopMode) {
      this.classMx4 = 'card';
      this.qrSize = 500;
    } else {
      this.classMx4 = 'card mx-4';
      this.qrSize = 300;
    }
  };

  openModal = (template: TemplateRef<any>): void => {
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  };

  isValid = (coupon: Coupon): boolean =>
    !coupon.valid_until || (Date.now() < coupon.valid_until);

}
