import {Component, OnDestroy, OnInit} from '@angular/core';
import {Breadcrumb} from "../../../core/breadcrumb/Breadcrumb";
import {BreadcrumbActions} from "../../../core/breadcrumb/breadcrumb.actions";

@Component({
  selector: 'app-feature-reserved-area-coupon-list',
  templateUrl: './coupon-list.component.html'
})

export class FeatureReservedAreaCouponListComponent implements OnInit, OnDestroy{

  constructor(private breadcrumbActions: BreadcrumbActions) { }

  ngOnInit(): void {
    this.addBreadcrumb();
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Your Coupons', '/reserved-area/list/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }

}
