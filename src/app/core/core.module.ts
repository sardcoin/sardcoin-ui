import {NgModule} from '@angular/core';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {LoginActions} from '../features/authentication/login/login.actions';
import {SidebarComponent} from './sidebar/sidebar.component';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsDropdownModule, ModalModule} from 'ngx-bootstrap';
import {BreadcrumbActions} from './breadcrumb/breadcrumb.actions';
import {CartActions} from '../features/reserved-area/consumer/cart/redux-cart/cart.actions';
import {GooglePlacesDirective} from './map/google-places.directive';
import {NgSelectModule} from '@ng-select/ng-select';
import {CouponService} from '../shared/_services/coupon.service';
import {CategoriesService} from '../shared/_services/categories.service';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {ClickOutsideModule} from 'ng-click-outside';
import {FilterActions} from '../features/reserved-area/consumer/coupon-showcase/redux-filter/filter.actions';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    BreadcrumbComponent,
    GooglePlacesDirective
  ],
  imports: [
    RouterModule,
    SharedModule,
    BsDropdownModule,
    ModalModule.forRoot(),
    NgSelectModule,
    Ng2SearchPipeModule,
    ClickOutsideModule
  ],
  providers: [
    LoginActions,
    CartActions,
    FilterActions,
    CouponService,
    CategoriesService,
    BsModalService,
    BreadcrumbActions,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    BreadcrumbComponent,
    GooglePlacesDirective
  ]
})

export class CoreModule { }
