import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {select} from '@angular-redux/store';
import {AuthenticationService} from '../../features/authentication/authentication.service';
import {StoreService} from '../_services/store.service';

@Injectable()

export class IsNotAuthenticatedGuard implements CanActivate {
  @select('login') loginState;

  constructor(private router: Router, private authService: AuthenticationService, private localStore: StoreService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    // Select the login item from the store

    if (this.localStore.getToken() === null) {
      ////console.log('Non è loggato');
      this.router.navigate(['authentication/login']);
      return true;
    }

    return false;

/*    return this.store.select('login').pipe(
      map(logState => {
          // If the token is stored, the user is logged and can access to the page

          if (logState['token'] == null) {
            return true;
          }

          this.router.navigate(['authentication/login']);
          return false;
        }
      ), take(1)
    );*/
  }
}
