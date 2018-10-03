import {Component, OnDestroy, OnInit} from '@angular/core';
import {Breadcrumb} from '../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../core/breadcrumb/breadcrumb.actions';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit, OnDestroy {
  bread = [] as Breadcrumb[];

  constructor(private breadcrumbActions: BreadcrumbActions) { }

  ngOnInit() {
    this.addBreadcrumb();

  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();

  }
  addBreadcrumb() {
    this.bread = [] as Breadcrumb[];

    this.bread.push(new Breadcrumb('Home', '/'));
    this.bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    this.bread.push(new Breadcrumb('Payment Details', '/reserved-area/payment_details'));

    this.breadcrumbActions.updateBreadcrumb(this.bread);
  }

}
