import {NgModule} from '@angular/core';
import {FeatureReservedAreaCouponCreateComponent} from './coupon-create.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {StoreService} from '../../../../shared/_services/store.service';
import {FileUploadModule} from 'ng2-file-upload';
import {FlatpickrModule} from 'angularx-flatpickr';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';
import {CoreModule} from '../../../../core/core.module';

@NgModule({
  declarations: [
    FeatureReservedAreaCouponCreateComponent,
  ],
  imports: [
    CommonModule,
    FileUploadModule,
    ReactiveFormsModule,
    Ng2FlatpickrModule,
    FlatpickrModule.forRoot()
  ],
  exports: [
    FeatureReservedAreaCouponCreateComponent
  ],
  providers: [
    StoreService
  ],
})
export class FeatureReservedAreaCouponCreateModule {}
