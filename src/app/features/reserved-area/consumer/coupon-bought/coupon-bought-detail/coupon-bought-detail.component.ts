import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RoutesRecognized } from '@angular/router';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { filter, pairwise } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { Breadcrumb } from '../../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../../core/breadcrumb/breadcrumb.actions';
import { ITEM_TYPE } from '../../../../../shared/_models/CartItem';
import { Coupon } from '../../../../../shared/_models/Coupon';
import { CouponService } from '../../../../../shared/_services/coupon.service';
import { GlobalEventsManagerService } from '../../../../../shared/_services/global-event-manager.service';
import { PackageService } from '../../../../../shared/_services/package.service';
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
  couponsPackage;

  ITEM_TYPE = ITEM_TYPE;

  modalRef: BsModalRef;
  isBoughtPath: boolean;

  constructor(
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService,
    private router: Router,
    private userService: UserService,
    private modalService: BsModalService,
    private globalEventService: GlobalEventsManagerService,
    private packageService: PackageService,
    private _sanitizer: DomSanitizer,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    this.couponService.currentMessage.subscribe(async coupon => {
      if (!coupon) {
        this.router.navigate(['/bought']);
      } else {
        this.couponPass = coupon;
        if (this.couponPass.type === ITEM_TYPE.PACKAGE) {
          const couponsIncluded = await this.packageService.getCouponsPackage(this.couponPass.id).toPromise();
          this.couponsPackage = _.groupBy(couponsIncluded.coupons_array, 'id');
        }
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
    this.location.back();
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
    !coupon.valid_until || (Date.now() < (new Date(coupon.valid_until)).getTime());

  getNumberCoupons = () => {
    const values = _.values(this.couponsPackage).map((el: Array<any>) => el.length);

    return values.length > 0 ? values.reduce((a, b) => a + b) : '';
  };
  byPassHTML(html: string) {
    //console.log('html', html, typeof html)
    return this._sanitizer.bypassSecurityTrustHtml(html)
  }

}
