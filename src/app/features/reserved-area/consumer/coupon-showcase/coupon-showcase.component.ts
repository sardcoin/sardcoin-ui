import {Component, OnDestroy, OnInit} from '@angular/core';
import {BreadcrumbActions} from "../../../../core/breadcrumb/breadcrumb.actions";
import {Breadcrumb} from "../../../../core/breadcrumb/Breadcrumb";

@Component({
  selector: 'app-feature-reserved-area-consumer-showcase',
  templateUrl: './coupon-showcase.component.html'
})
export class FeatureReservedAreaConsumerShowcaseComponent implements OnInit, OnDestroy {

  constructor(private breadcrumbActions: BreadcrumbActions) {

  }

  ngOnInit(): void {
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
}
