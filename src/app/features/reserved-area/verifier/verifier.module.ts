import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppFooterModule } from '@coreui/angular';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CoreModule } from '../../../core/core.module';
import { CouponService } from '../../../shared/_services/coupon.service';
import { SharedModule } from '../../../shared/shared.module';
import { VerifierComponent } from './verifier.component';
import { VerifierRoutingModule } from './verifier.routing';

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
