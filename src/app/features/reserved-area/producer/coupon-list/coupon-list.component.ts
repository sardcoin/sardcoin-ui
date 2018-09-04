import {Component, TemplateRef, OnDestroy, OnInit, Input} from '@angular/core';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-feature-reserved-area-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.css']
})

export class FeatureReservedAreaCouponListComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;
  message: string;
  couponArray: any;
  couponArrayTitleAndQuantity: any = [];

  constructor(private modalService: BsModalService,
              private couponService: CouponService,
              private router: Router,
              private breadcrumbActions: BreadcrumbActions,
              private _sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.control();
    console.log('vedi qua dopo tutto in ngOnInit', this.couponArrayTitleAndQuantity);



    this.addBreadcrumb();
  }


  onEdit(coupon: any) {
    this.couponService.setCoupon(coupon);
    console.log('coupon.id: ' + coupon.id);
  }

  onDelete(coupon_id: number) {
    this.message = 'Confirmed!';

    console.log('coupon_id: ', coupon_id);
    this.couponService.deleteCoupon(coupon_id)
      .subscribe(dataDeleted => {

          this.control();

        }, error => {
          console.log(error);
        }
      );

    this.modalRef.hide();
  }

  onDetails() {

  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Producer', '/reserved-area/producer/'));
    bread.push(new Breadcrumb('My coupons', '/reserved-area/producer/list/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  ngOnDestroy() {
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

  formatState(state) {
/*    switch (state) {
      case 0:
        return 'Active';
      default:
        return 'unknown';
    }*/
    return 'Active';
  }

  control() {

    this.couponService.getCreatedCoupons().subscribe(
      data => {
        this.couponArray = data;
      },
      error => console.log(error)
    );

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef.hide();
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }


}
