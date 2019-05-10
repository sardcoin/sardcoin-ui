import {LoginState} from '../../features/authentication/login/login.model';
import {LOGIN_INITIAL_STATE} from '../../features/authentication/login/login.model';
import {BREADCRUMB_INITIAL_STATE, BreadcrumbState} from '../../core/breadcrumb/breadcrumb.model';
import {CART_INITIAL_STATE, CartState} from '../../features/reserved-area/consumer/cart/redux-cart/cart.model';
import {FILTER_INITIAL_STATE, FilterState} from '../../features/reserved-area/consumer/coupon-showcase/redux-filter/filter.model';

export interface IAppState {
  login: LoginState;
  breadcrumb: BreadcrumbState;
  cart: CartState;
  filter: FilterState;
}

export const FIRST_STATE: IAppState = {
  login: LOGIN_INITIAL_STATE,
  breadcrumb: BREADCRUMB_INITIAL_STATE,
  cart: CART_INITIAL_STATE,
  filter: FILTER_INITIAL_STATE
};
