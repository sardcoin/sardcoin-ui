import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {VerifierComponent} from './verifier.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        // redirectTo: 'verifier',
        // pathMatch: 'full'
      // },
      // {
      //   path: 'verifier',
        component: VerifierComponent
      },
    ])
  ],
  exports: [RouterModule]
})
export class VerifierRoutingModule {
}
