import {LOGIN_USER, LOGIN_USER_ERROR, LOGOUT_USER, LOGGED_USER} from './login.actions';
import {LOGIN_INITIAL_STATE, LoginState} from './login.model';

export function LoginReducer(state: LoginState = LOGIN_INITIAL_STATE , action): LoginState {

  switch (action.type) {
    case LOGIN_USER:
      return Object.assign({}, state,
        {
          token: null,
          hasError: false,
          isLoading: true,
          isLogged: false
        });

    case LOGGED_USER:
      return Object.assign({}, state,
        {
          token: action.token,
          hasError: false,
          isLoading: false,
          isLogged: true
        });

    case LOGIN_USER_ERROR:
      return Object.assign({}, state,
        {
          token: null,
          hasError: true,
          isLoading: false,
          isLogged: false
        });

    case LOGOUT_USER:
      return Object.assign({}, state,
        {
          token: null,
          hasError: false,
          isLoading: false,
          isLogged: false
        });
    default:
      return state;
    }
}
