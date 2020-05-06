import {NgModule} from '@angular/core';
import { QuillModule } from 'ngx-quill';
import {FeatureReservedAreaCouponCreateComponent} from './coupon-create.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {StoreService} from '../../../../shared/_services/store.service';
import {FileUploadModule} from 'ng2-file-upload';
import {FlatpickrModule} from 'angularx-flatpickr';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';
import {CoreModule} from '../../../../core/core.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PopoverModule } from 'ngx-bootstrap';



@NgModule({
  declarations: [
    FeatureReservedAreaCouponCreateComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    FileUploadModule,
    ReactiveFormsModule,
    Ng2FlatpickrModule,
    NgSelectModule,
    FormsModule,
    FlatpickrModule.forRoot(),
    PopoverModule.forRoot(),
    QuillModule
  ],
  exports: [
    FeatureReservedAreaCouponCreateComponent
  ],
  providers: [
    StoreService
  ],
})
export class FeatureReservedAreaCouponCreateModule {}
