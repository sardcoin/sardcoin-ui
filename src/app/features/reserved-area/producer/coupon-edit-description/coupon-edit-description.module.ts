import {NgModule} from '@angular/core';
import { BlockUIModule } from 'ng-block-ui';
import { QuillModule } from 'ngx-quill';
import {CouponEditDescriptionComponent} from './coupon-edit-description.component';
import {SharedModule} from '../../../../shared/shared.module';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {FileUploadModule} from 'ng2-file-upload';
import {StoreService} from '../../../../shared/_services/store.service';
import {CommonModule} from '@angular/common';
import {FlatpickrModule} from 'angularx-flatpickr';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
  declarations: [
    CouponEditDescriptionComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FileUploadModule,
    NgSelectModule,
    FlatpickrModule.forRoot(),
    QuillModule
  ],
  exports: [
  ],
  providers: [
    BreadcrumbActions,
    StoreService
  ]

})
export class FeatureReservedAreaCouponEditDescriptionModule {
}
