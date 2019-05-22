/** Login Actions **/

import {Injectable} from '@angular/core';
import {IAppState} from '../../../shared/store/model';
import {NgRedux} from '@angular-redux/store';
import {Router} from '@angular/router';
import {User} from '../../../shared/_models/User';
import {StoreService} from '../../../shared/_services/store.service';
import {GlobalEventsManagerService} from '../../../shared/_services/global-event-manager.service';
import {ToastrService} from 'ngx-toastr';

export const LOGIN_USER          = 'LOGIN_USER';
export const LOGIN_USER_ERROR    = 'LOGIN_USER_ERROR';
export const LOGGED_USER         = 'LOGGED_USER';
export const LOGOUT_USER         = 'LOGOUT_USER';

@Injectable()
export class LoginActions {
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private router: Router,
    private storeLocal: StoreService,
    private eventManager: GlobalEventsManagerService,
    private toastr: ToastrService
    ) {}

  loginUser() {
    this.ngRedux.dispatch({ type: LOGIN_USER });
  }

  loginUserSuccess(user: User, token: string) {
    this.ngRedux.dispatch({ type: LOGGED_USER, token: token });

    this.storeLocal.setToken(token);
    this.storeLocal.setId(user.id);
    this.storeLocal.setType(user.user_type);
    this.storeLocal.setUserNames(user.first_name + ' ' + user.last_name);

    this.eventManager.userType.next(user.user_type);
  }

  loginUserError() {
    this.ngRedux.dispatch({ type: LOGIN_USER_ERROR });
  }

  // TODO add method to pass true to the loggedIn, remove User from the model and give just the token and other infos useful, not everything

  logoutUser() {
    // If the user is logged in
    if(this.areUserInfoStored()) {
      this.ngRedux.dispatch({ type: LOGOUT_USER });

      this.storeLocal.removeToken();
      this.storeLocal.removeId();
      this.storeLocal.removeType();
      this.storeLocal.removeUserNames();
      this.storeLocal.removeCart();

      this.router.navigate(['/']);
    }
  }

  userLogged(){
    if(this.areUserInfoStored()) {
      this.ngRedux.dispatch({type: LOGGED_USER, token: this.storeLocal.getToken()});
    }
  }

  areUserInfoStored(){
    return this.storeLocal.getType() && this.storeLocal.getToken() && this.storeLocal.getId() && this.storeLocal.getUserNames();
  }

}
