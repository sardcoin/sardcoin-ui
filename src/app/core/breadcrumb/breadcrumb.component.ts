import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GlobalEventsManagerService} from '../../shared/_services/global-event-manager.service';
import {NgRedux, select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {Breadcrumb} from './Breadcrumb';
import {IAppState} from '../../shared/store/model';
import {Router} from '@angular/router';
import {BreadcrumbActions} from './breadcrumb.actions';
import {CartItem} from '../../shared/_models/CartItem';

@Component({
  selector: 'app-core-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})

export class BreadcrumbComponent {

  cart: CartItem[];
  @select() breadcrumb$: Observable<Breadcrumb[]>;
  @select() cart$: Observable<CartItem[]>;
  breadList = [];
  isUserLoggedIn: boolean;
  url: string;
  desktopMode = true;
  userType: number = null;
  hide;

  constructor(
    private globalEventService: GlobalEventsManagerService,
    private ngRedux: NgRedux<IAppState>,
    private breadcrumbActions: BreadcrumbActions,
    private router: Router,
  ) {
    this.globalEventService.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
      this.userType = Number(this.globalEventService.userType.getValue());
    });

    this.globalEventService.desktopMode.subscribe(message => {
      this.desktopMode = message
    });

    this.globalEventService.hideSource.subscribe(message => {
      this.hide = message;
    });


    this.breadcrumb$.subscribe(elements => {
      this.breadList = elements['list'];
    });

    this.cart$.subscribe(elements => {
      this.cart = elements['list'];
    });

    this.url = this.router.url;
  }

  viewCart() {
    this.router.navigate(['/reserved-area/consumer/cart']);
  }

  navigateTo(value) {
    if (value) {
      this.router.navigate([value]);
    }
  }

}
