import {Component, OnDestroy, OnInit} from '@angular/core';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';

@Component({
  selector: 'app-feature-reserved-area-broker-report',
  templateUrl: './package-report.component.html',
  styleUrls: ['./package-report.component.scss']
})
export class FeatureReservedAreaBrokerPackageReportComponent implements OnInit, OnDestroy {

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
    bread.push(new Breadcrumb('Report', '/reserved-area/broker/report'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

}
