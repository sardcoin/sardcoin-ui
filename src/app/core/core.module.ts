import {NgModule} from '@angular/core';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {LoginActions} from '../features/authentication/login/login.actions';
import {SidebarComponent} from './sidebar/sidebar.component';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ModalModule} from 'ngx-bootstrap';
import {BreadcrumbActions} from './breadcrumb/breadcrumb.actions';
import {CartActions} from '../features/reserved-area/consumer/cart/redux-cart/cart.actions';
import {GooglePlacesDirective} from './map/google-places.directive';

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
    ModalModule.forRoot()
  ],
  providers: [
    LoginActions,
    CartActions,
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
