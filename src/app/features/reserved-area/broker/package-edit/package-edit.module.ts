import {NgModule} from '@angular/core';
import {PackageEditComponent} from './package-edit.component';
import {SharedModule} from '../../../../shared/shared.module';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {FileUploadModule} from 'ng2-file-upload';
import {StoreService} from '../../../../shared/_services/store.service';
import {CommonModule} from '@angular/common';
import {FlatpickrModule} from 'angularx-flatpickr';

@NgModule({
  declarations: [
    PackageEditComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FileUploadModule,
    FlatpickrModule.forRoot(),
  ],
  exports: [
  ],
  providers: [
    BreadcrumbActions,
    StoreService
  ],

})
export class FeatureReservedAreaPackageEditModule {
}
