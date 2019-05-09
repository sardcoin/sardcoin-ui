import {NgModule} from '@angular/core';
import {FeatureReservedAreaPackageListComponent} from './package-list.component';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {SharedModule} from '../../../../shared/shared.module';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsDropdownModule, ModalModule} from 'ngx-bootstrap';

import {ModalBackdropComponent} from 'ngx-bootstrap';

@NgModule({
  declarations: [
    FeatureReservedAreaPackageListComponent,
  ],
  imports: [
    SharedModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  exports: [
    FeatureReservedAreaPackageListComponent,
  ],
  providers: [
    BreadcrumbActions,
    BsModalService
  ]
})
export class FeatureReservedAreaPackageListModule {
}
