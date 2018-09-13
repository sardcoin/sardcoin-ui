import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {environment} from '../../../../../environments/environment';
import {Router} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-coupon-details',
  templateUrl: './coupon-details.component.html',
  styleUrls: ['./coupon-details.component.scss']
})

export class CouponDetailsComponent implements OnInit, OnDestroy {
  URLstring = 'http://' + environment.host + ':' + environment.port + '/';
  modalRef: BsModalRef;
  message: string;
  couponPass: any;

  constructor(
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.couponService.currentMessage.subscribe(coupon => this.couponPass = coupon);
    this.URLstring = this.URLstring + this.couponPass.image;

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
    bread.push(new Breadcrumb(this.couponPass.title, '/reserved-area/consumer/showcase'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }
  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  formatPrice(price) {
    if (price === 0) {
      return 'Free';
    }

    return '€ ' + price.toFixed(2);
  }

  formatUntil(until) {
    if (until === null) {
      return 'Unlimited';
    }

    return until;
  }

  formatFrom(dataFrom){
    return dataFrom.toString().substring(0, dataFrom.indexOf('T'));
  }

  retry() {
    this.router.navigate(['/reserved-area/consumer/showcase']);
  }

  addToCart() {
    this.message = 'Confirmed!';
    this.modalRef.hide();
    console.log('coupon buy');
    this.toastBuy();


  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }


  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef.hide();
    this.toastBuy();

  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  toastBuy() {
    this.toastr.success('Bought coupon', 'Coupon bought successfully');
  }

}
