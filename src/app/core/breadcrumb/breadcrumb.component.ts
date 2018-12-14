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

  cart: CartItem[];
  @select() breadcrumb$: Observable<Breadcrumb[]>;
  @select() cart$: Observable<CartItem[]>;
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

    this.breadcrumb$.subscribe(elements => {
      this.breadList = elements['list'];
    });

    this.cart$.subscribe(elements => {
      this.cart = elements['list'];
    })

  }

  ngOnInit(): void {
  }

  viewCart() {
    this.router.navigate(['/reserved-area/consumer/cart']);
  }

}
