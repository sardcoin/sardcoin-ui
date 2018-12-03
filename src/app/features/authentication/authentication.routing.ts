import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {FeatureAuthenticationLoginComponent} from './login/login.component';
import {FeatureAuthenticationRegisterComponent} from './register/register.component';
import {RegisterFormProducerComponent} from './register/register-form-producer/register-form-producer.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'login'
      },
      {
        path: 'login',
        component: FeatureAuthenticationLoginComponent
      },
      {
        path: 'register',
        component: FeatureAuthenticationRegisterComponent
      },
      {
        path: 'create-producer',
        component: RegisterFormProducerComponent
      }
    ])
  ],
  exports: [RouterModule]
})

export class FeatureAuthenticationRoutingModule { }
