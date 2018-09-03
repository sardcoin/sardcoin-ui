import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BreadcrumbActions} from "../../../../core/breadcrumb/breadcrumb.actions";
import {Breadcrumb} from "../../../../core/breadcrumb/Breadcrumb";
import {Coupon} from "../../../../shared/_models/Coupon";
import {CouponService} from "../../../../shared/_services/coupon.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
// import Any = jasmine.Any;

@Component({
  selector: 'app-feature-reserved-area-consumer-showcase',
  templateUrl: './coupon-showcase.component.html',
  styleUrls: ['./coupon-showcase.component.scss']
})
export class FeatureReservedAreaConsumerShowcaseComponent implements OnInit, OnDestroy {

  coupons: any;
  modalRef: BsModalRef;
  message: string;
  @Input() couponPass: any;

  constructor(
    private couponService: CouponService,
    private breadcrumbActions: BreadcrumbActions,
    private _sanitizer: DomSanitizer,
    private router: Router,
    private modalService: BsModalService,

  ) { }

  ngOnInit(): void {
    this.loadCoupons();
    this.addBreadcrumb();
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Consumer', '/reserved-area/consumer/'));
    bread.push(new Breadcrumb('Showcase', '/reserved-area/consumer/showcase'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  loadCoupons() {
    this.couponService.getAffordables()
      .subscribe(coupons => {
        this.coupons = coupons
      }, err => {
        console.log(err);
      })
  }

  imageUrl(path) {
    // let subs = path.substr(path.lastIndexOf('\\')+1);
    return this._sanitizer.bypassSecurityTrustUrl('http://' + environment.host + ':' + environment.port + '/' +  path);
  }

  formatPrice(price) {
    if(price === 0) {
      return 'Free'
    }

    return '€ ' + price;
  }



  details(coupon: any) {
    this.couponService.setCoupon(coupon);

    this.router.navigate(['/reserved-area/consumer/details']);
  }


  buy() {
    this.message = 'Confirmed!';
    this.modalRef.hide();
    console.log('coupon buy');

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
