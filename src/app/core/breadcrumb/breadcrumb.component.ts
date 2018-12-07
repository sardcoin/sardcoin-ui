import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GlobalEventsManagerService} from '../../shared/_services/global-event-manager.service';
import {NgRedux, select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {Breadcrumb} from './Breadcrumb';
import {IAppState} from '../../shared/store/model';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {Router} from '@angular/router';
import {BreadcrumbActions} from './breadcrumb.actions';
import {CartItem} from '../../shared/_models/CartItem';

@Component({
  selector: 'app-core-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})

export class BreadcrumbComponent implements OnInit {

  cartLength = 0;
  @select() breadcrumb$: Observable<Breadcrumb[]>;
  breadList = [];
  isUserLoggedIn: boolean;


  constructor(
    private globalEventService: GlobalEventsManagerService,
    private ngRedux: NgRedux<IAppState>,
    private breadcrumbActions: BreadcrumbActions,
    private router: Router,
    protected localStorage: LocalStorage
  ) {
    this.globalEventService.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    this.localStorage.getItem<CartItem[]>('cart').subscribe(cart => {
      this.breadcrumbActions.updateCartLength(cart.length);
    });

    this.breadcrumb$.subscribe(elements => {
      this.breadList = elements['list'];
      this.cartLength = elements['cartLength'];
    });
  }

  ngOnInit(): void {
  }

  viewCart() {
    this.router.navigate(['/reserved-area/consumer/cart']);
  }

}
