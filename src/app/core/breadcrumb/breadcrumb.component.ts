import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GlobalEventsManagerService} from '../../shared/_services/global-event-manager.service';
import {NgRedux, select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {Breadcrumb} from './Breadcrumb';
import {IAppState} from '../../shared/store/model';
import {CartController} from '../../features/reserved-area/consumer/cart/cart-controller';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {Router} from '@angular/router';
import {importExpr} from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-core-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})

export class BreadcrumbComponent implements OnInit, OnChanges {

  @Input() arrayCart = [];
  @select() breadcrumb$: Observable<Breadcrumb[]>;
  breadList = [];
  isUserLoggedIn: boolean;


  constructor(private globalEventService: GlobalEventsManagerService,
              private ngRedux: NgRedux<IAppState>,
              private router: Router,
              protected localStorage: LocalStorage) {
    this.globalEventService.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    this.breadcrumb$.subscribe(elements => {
      this.breadList = elements['list'];
      // console.log('bread', this.breadList);
      this.localStorage.getItem('cart').subscribe((data) => {

        if (data === null) {
          this.arrayCart = [];
          return;
        } else {
          this.arrayCart = data;
          return;
        }
      });
    });
  }

  ngOnInit(): void {

    this.localStorage.getItem('cart').subscribe((data) => {

      if (data === null) {
        this.arrayCart = [];
        return;
      } else {
        this.arrayCart = data;
        return;
      }
    });

  }

  viewCart() {

    this.router.navigate(['/reserved-area/consumer/cart']);
  }

  ngOnChanges(changes: SimpleChanges): void {

     {

      console.log(
        'Value change from',
        changes.arrayCart,

      );

    }
  }

}
