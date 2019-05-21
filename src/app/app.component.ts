import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {CartActions} from './features/reserved-area/consumer/cart/redux-cart/cart.actions';
import {GlobalEventsManagerService} from './shared/_services/global-event-manager.service';

@Component({
  // tslint:disable-next-line
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  // templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor( private router: Router, private cartActions: CartActions, private GEmanager: GlobalEventsManagerService) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this.cartActions.initData();
  }

}
