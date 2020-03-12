import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { token } from 'flatpickr/dist/utils/formatting';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { Breadcrumb } from '../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { Coupon } from '../../../../shared/_models/Coupon';
import { CouponService } from '../../../../shared/_services/coupon.service';
import Arrays from '@zxing/library/esm5/core/util/Arrays';

@Component({
  selector: 'app-feature-reserved-area-coupon-offline',
  templateUrl: './coupon-offline.component.html',
  styleUrls: ['./coupon-offline.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FeatureReservedAreaCouponOfflineComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;
  modalCoupon: Coupon;

  dataSource: MatTableDataSource<Coupon>;
  displayedColumns: Array<string> = ['title', 'image', 'price', 'state', 'quantity', 'buyed', 'buttons'];

  @ViewChild('template') template: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private modalService: BsModalService,
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

  showToken = (coupon: Coupon): void => {
    this.couponService.getProducerTokensOfflineById(coupon.id).subscribe(tokens => {
      ////console.log('tokens', tokens);
      coupon.CouponTokens = tokens;
      this.couponService.setCoupon(coupon);
      this.router.navigate(['reserved-area/producer/offline-details']);
    });

  };

  formatState = (state): string => 'Attivo'; // TODO fix

  addBreadcrumb = (): void => {
    const bread: Array<Breadcrumb> = [];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('I miei coupon', '/reserved-area/producer/offline/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  };

  removeBreadcrumb = (): void => {
    this.breadcrumbActions.deleteBreadcrumb();
  };

  ngOnDestroy = (): void => {
    this.removeBreadcrumb();
  };

  imageUrl = (path): SafeUrl =>
    // return correct address and port backend plus name image
    this._sanitizer.bypassSecurityTrustUrl(`${environment.protocol}://${environment.host}:${environment.port}/${path}`);

  formatPrice = (price): string =>
    price === 0 ? 'Gratis' : `€ ${price.toFixed(2)}`;

  control = (): void => {
    this.couponService.getProducerCouponsOffline()
      .subscribe(data => {
          ////console.log('data', data);
          if (data) {
              this.dataSource = new MatTableDataSource(data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
          }
        }, error => //console.log(error)
      );
  };

  openModal = (coupon: Coupon): void => {
    this.modalCoupon = coupon;
    this.modalRef = this.modalService.show(this.template, {class: 'modal-md modal-dialog-centered'});
  };

  decline = (): void => {
    this.modalRef.hide();
  };
}
