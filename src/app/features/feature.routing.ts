import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

/** App Components **/
import {FeatureComponent} from './feature.component';
import {IsAuthenticatedGuard} from '../shared/_guards/is-authenticated.guard';
import {AuthenticationService} from './authentication/authentication.service';
import {P404Component} from '../errors/404.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: FeatureComponent,
        children: [
          {
            path: '',
            redirectTo: 'reserved-area',
            pathMatch: 'full'
          },
          {
            path: 'reserved-area',
            canActivate: [
              IsAuthenticatedGuard
            ],
            loadChildren: './reserved-area/reserved-area.module#FeatureDashboardModule',
            data: {
              title: 'Dashboard',
              requiresLogin: true
            },
          },
          {
            path: 'authentication',
            loadChildren: './authentication/authentication.module#FeatureAuthenticationModule'
          },
        ],
      },
      {
        path: '**',
        component: P404Component
      }
    ])
  ],
  providers: [IsAuthenticatedGuard, AuthenticationService],
  exports: [RouterModule],
})
export class FeatureRoutingModule {
}
