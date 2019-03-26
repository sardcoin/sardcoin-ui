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
  ],
  providers: [
    LoginActions,
    CartActions,
    CouponService, // TODO remove after REDUX
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
