import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../../core/core.module';
import {SharedModule} from '../../../shared/shared.module';
import {AppFooterModule} from '@coreui/angular';
import {CouponService} from '../../../shared/_services/coupon.service';
import {NgModule} from '@angular/core';
import {VerifierComponent} from './verifier.component';
import {VerifierRoutingModule} from './verifier.routing';
import {ZXingScannerModule} from '@zxing/ngx-scanner';

@NgModule({
  declarations: [
    VerifierComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    AppFooterModule,
    VerifierRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    ZXingScannerModule.forRoot()
  ],
  providers: [
    CouponService
  ],
  exports: [
    VerifierComponent
  ]
})

export class VerifierModule {
}
