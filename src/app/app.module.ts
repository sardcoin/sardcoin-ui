/** INTERNAL MODULES **/
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

/** INTERNAL COMPONENTS **/
import {GlobalEventsManagerService} from './shared/_services/global-event-manager.service';
import {CartActions} from './features/reserved-area/consumer/cart/redux-cart/cart.actions';
import {CouponService} from './shared/_services/coupon.service';
import {StoreService} from './shared/_services/store.service';
import {StoreModule} from './shared/store/store.module';
import {JwtInterceptor} from './shared/jwt.interceptor';
import {AppRoutingModule} from './app.routing';
import {CoreModule} from './core/core.module';
import {AppComponent} from './app.component';

/** EXTERNAL LIBRARIES **/
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {AlertModule} from 'ngx-bootstrap/alert';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {ToastrModule} from 'ngx-toastr';

@NgModule({
  imports: [
    ToastrModule.forRoot({
      timeOut: 5000,
      progressBar: true,
      preventDuplicates: true
    }),
    BsDropdownModule.forRoot(),
    BrowserAnimationsModule,
    PerfectScrollbarModule,
    AlertModule.forRoot(),
    TabsModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserModule,
    ChartsModule,
    StoreModule,
    CoreModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    GlobalEventsManagerService,
    CouponService,
    StoreService,
    CartActions,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
