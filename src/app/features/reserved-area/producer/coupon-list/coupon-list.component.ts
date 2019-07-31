import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { Breadcrumb } from '../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { Coupon } from '../../../../shared/_models/Coupon';
import { CouponService } from '../../../../shared/_services/coupon.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-feature-reserved-area-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FeatureReservedAreaCouponListComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;
  modalCoupon: Coupon;

  dataSource: MatTableDataSource<Coupon>; // = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
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

  ngOnInit() {
    this.control();
    this.addBreadcrumb();
    // this.translatePaginator();
  }

  onEdit = (coupon: Coupon): void => {
    this.couponService.setCoupon(coupon);
    this.couponService.setFromEdit(true);
    this.router.navigate(['reserved-area/producer/edit']);
  };

  onCopy = (coupon: Coupon): void => {
    this.couponService.setCoupon(coupon);
    this.couponService.setFromEdit(false);
    this.router.navigate(['reserved-area/producer/edit']);
  };

  onDelete = (coupon: Coupon): void => {
    this.couponService.deleteCoupon(coupon.id)
      .subscribe(data => {
        if (data.deleted) {
          this.toastr.success('', 'Coupon eliminato!');
          this.control();
        }
      }, error => {
        console.log(error);
        this.toastr.error('Si è verificato un errore durante l\'eliminazione del coupon.', 'Errore');
      });

    this.modalRef.hide();
  };

  formatState = (state): string => 'Attivo'; // TODO fix

  addBreadcrumb = (): void => {
    const bread: Array<Breadcrumb> = [];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('I miei coupon', '/reserved-area/producer/list/'));

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
    this.couponService.getProducerCoupons()
      .subscribe(data => {
          // this.couponArray = data;
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, error => console.log(error)
      );
  };

  translatePaginator = (): void => {
    this.paginator._intl.itemsPerPageLabel = 'Numero di elementi: ';
    this.paginator._intl.firstPageLabel = 'Prima pagina';
    this.paginator._intl.lastPageLabel = 'Ultima pagina';
    this.paginator._intl.nextPageLabel = 'Pagina successiva';
    this.paginator._intl.previousPageLabel = 'Pagina precedente';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => `${page} di ${length}`;
  };

  openModal = (coupon: Coupon): void => {
    this.modalCoupon = coupon;
    this.modalRef = this.modalService.show(this.template, {class: 'modal-md modal-dialog-centered'});
  };

  decline = (): void => {
    this.modalRef.hide();
  };
}
