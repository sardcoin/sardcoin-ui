import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginActions } from '../../features/authentication/login/login.actions';
import { GlobalEventsManagerService } from '../_services/global-event-manager.service';
import { StoreService } from '../_services/store.service';

@Injectable()

// TODO Fix guards

export class IsVerifierGuard implements CanActivate {
  constructor(
    private router: Router,
    private localStore: StoreService,
    private loginActions: LoginActions,
    private eventEmitter: GlobalEventsManagerService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    // If the token exists, then the user is logged in and can carry on
    if (this.localStore.getToken() !== null) {

      // this.eventEmitter.isUserLoggedIn.next(true);
      this.loginActions.userLogged();

      switch (this.localStore.getType()) {
        case '0': // admin
          this.eventEmitter.userType.next('0');

          return true;
        case '1': // producer
          this.eventEmitter.userType.next('1');

          return true;
        case '2': // consumer
          this.eventEmitter.userType.next('2');

          return false;
        case '3': // verify
          this.eventEmitter.userType.next('3');

          return true;
        case '4': // broker
          this.eventEmitter.userType.next('4');

          return false;
        default:
          return false;
      }
    }

    // If the user is not logged in, he is redirect to the login view
    this.eventEmitter.isUserLoggedIn.next(false);
    this.router.navigate(['authentication/login']);

    return false;
  }
}
