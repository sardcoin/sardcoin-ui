import {Component, TemplateRef, OnDestroy, OnInit} from '@angular/core';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {environment} from '../../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {Coupon} from '../../../../shared/_models/Coupon';

@Component({
  selector: 'app-feature-reserved-area-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css']
})

export class FeatureReservedAreaPackageListComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;
  modalCoupon: Coupon;
  couponArray: any;

  constructor(private modalService: BsModalService,
              private couponService: CouponService,
              private router: Router,
              private breadcrumbActions: BreadcrumbActions,
              private _sanitizer: DomSanitizer,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.control();
    this.addBreadcrumb();
  }


  onEdit(coupon: Coupon) {
    this.couponService.setCoupon(coupon);
    this.couponService.setFromEdit(true);
    this.router.navigate(['reserved-area/producer/edit']);
  }

  onCopy(coupon: Coupon) {
    this.couponService.setCoupon(coupon);
    this.couponService.setFromEdit(false);
    this.router.navigate(['reserved-area/producer/edit']);
  }


  onDelete(coupon: Coupon) {
    this.couponService.deleteCoupon(coupon.id).subscribe((data) => {

      if (data['deleted']) {
        this.toastr.success('', 'Coupon eliminato!');
        this.control();
      }
    }, error => {
      console.log(error);
      this.toastr.error('Si è verificato un errore durante l\'eliminazione del coupon.', 'Errore');
    });

    this.modalRef.hide();
  }

  formatState(state) { // TODO fixme
    return 'Attivo';
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('I miei coupon', '/reserved-area/producer/list/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }

  imageUrl(path) {
    // return correct address and port backend plus name image
    return this._sanitizer.bypassSecurityTrustUrl(environment.protocol + '://' + environment.host + ':' + environment.port + '/' + path);
  }

  formatPrice(price) {
    if (price === 0) {
      return 'Gratis';
    }

    return '€ ' + price.toFixed(2);
  }


  control() {
    this.couponService.getProducerCoupons().subscribe(
      data => {
        this.couponArray = data;
      }, error => console.log(error)
    );
  }

  openModal(template: TemplateRef<any>, coupon: Coupon) {
    this.modalCoupon = coupon;
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }

  decline(): void {
    this.modalRef.hide();
  }
}
