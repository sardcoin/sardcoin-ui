import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { VerifierComponent } from './verifier.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'check',
        pathMatch: 'full'
      },
      {
        path: 'check',
        component: VerifierComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class VerifierRoutingModule {
}
