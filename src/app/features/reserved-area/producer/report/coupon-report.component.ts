import {Component, OnDestroy, OnInit} from '@angular/core';
import {Breadcrumb} from "../../../../core/breadcrumb/Breadcrumb";
import {BreadcrumbActions} from "../../../../core/breadcrumb/breadcrumb.actions";

@Component({
  selector: 'app-feature-reserved-area-producer-report',
  templateUrl: './coupon-report.component.html',
  styleUrls: ['./coupon-report.component.scss']
})
export class FeatureReservedAreaProducerCouponReportComponent implements OnInit, OnDestroy {

  constructor(
    private breadcrumbActions: BreadcrumbActions
  ) { }

  ngOnInit() {
    this.addBreadcrumb();
  }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Ricevute', '/reserved-area/producer/report'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

}
