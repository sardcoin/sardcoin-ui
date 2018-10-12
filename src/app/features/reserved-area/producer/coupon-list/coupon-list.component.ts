import {Component, TemplateRef, OnDestroy, OnInit, Input} from '@angular/core';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {environment} from '../../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-feature-reserved-area-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.css']
})

export class FeatureReservedAreaCouponListComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;
  message: string;
  couponArray = [];
  arrayCreatedCoupons: any;

  constructor(private modalService: BsModalService,
              private couponService: CouponService,
              private router: Router,
              private breadcrumbActions: BreadcrumbActions,
              private _sanitizer: DomSanitizer,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.control();
    // console.log('vedi qua dopo tutto in ngOnInit', this.couponArrayTitleAndQuantity);


    this.addBreadcrumb();
  }


  onEdit(coupon: any) {
    const cp = JSON.parse(JSON.stringify(coupon))
    this.couponService.setCoupon(cp);
    this.couponService.setFromEdit(true);
    this.router.navigate(['reserved-area/producer/edit']);

    console.log('coupon: ', cp.id);
  }

  onCopy(coupon: any) {
    this.couponService.setCoupon(coupon);
    this.couponService.setFromEdit(false);
    this.router.navigate(['reserved-area/producer/edit']);

    // console.log('coupon.id: ' + coupon.id);
  }


  onDelete(cp: any) {
    this.message = 'Confirmed!';

    this.couponService.getCouponsCreatedFromTitleDescriptionPrice(cp).subscribe(coupons => {

      console.log('coupons', coupons)
      const getCouponsCreatedFromTitleDescriptionPrice = JSON.parse(JSON.stringify(coupons));
      for (const i of getCouponsCreatedFromTitleDescriptionPrice) {
      this.couponService.deleteCoupon(i.id)
        .subscribe(dataDeleted => {

          }, error => {
            console.log(error);
          }
        );
      }
      this.control();
    });

    this.modalRef.hide();
    this.toastDelete();
  }

  onDetails() {

  }

  formatState(state) { // TODO fixme
    /*    switch (state) {
          case 0:
            return 'Active';
          default:
            return 'unknown';
        }*/
    return 'Active';
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


  control() {

    this.couponService.getDistinctCreatedCoupons().subscribe(
      data => {
       this.arrayCreatedCoupons = data;
        const array = [];
        // let filter = [];
        for (const i of this.arrayCreatedCoupons) {
          array.push(i); // mi creo l'array per manipolarlo meglio


        }
        // filtro l'array con token univoco (coupons con token tutti diversi)
        // filter = array.reduce((x, y) => x.findIndex(e => e.token === y.token) < 0 ? [...x, y] : x, []);

        // // esempio:
        // const some = [ {name: 'Guille', last: 'Foo'}, {name: 'Jorge', last: 'bar'}, {name: 'Pedro', last: 'Foo'}, {name: 'Guille', last: 'Ipsum'} ];
        // const result = some.reduce((x, y) => x.findIndex(e => e.name === y.name) < 0 ? [...x, y] : x, []);

        // console.log('some', result);

        this.couponArray = array;
        // console.log('set', array);
        // console.log(data);
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

  toastDelete() {
    this.toastr.success('Delete coupon', 'Coupon deleted successfully');
  }

}
