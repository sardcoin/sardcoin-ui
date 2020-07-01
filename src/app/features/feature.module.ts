import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill';
import { CoreModule } from '../core/core.module';
import { P404Component } from '../errors/404.component';
import { P500Component } from '../errors/500.component';
import { IsAuthenticatedGuard } from '../shared/_guards/is-authenticated.guard';
import { IsConsumerGuard } from '../shared/_guards/is-consumer.guard';
import { SharedModule } from '../shared/shared.module';
import { FeatureComponent } from './feature.component';
import { FeatureRoutingModule } from './feature.routing';

@NgModule({
  declarations: [
    FeatureComponent,
    P404Component,
    P500Component,
  ],
  imports: [
    FeatureRoutingModule,
    SharedModule,
    CoreModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    CommonModule,
    QuillModule.forRoot(),
    BlockUIModule.forRoot()

  ],
  providers: [
    IsAuthenticatedGuard,
    IsConsumerGuard
  ],
  exports: []
})

export class FeatureModule {
}
