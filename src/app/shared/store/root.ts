import {combineReducers} from 'redux';
import {LoginReducer} from '../../features/authentication/login/login.reducer';
import {BreadcrumbReducer} from '../../core/breadcrumb/breadcrumb.reducer';
import {CartReducer} from '../../features/reserved-area/consumer/cart/redux-cart/cart.reducer';
import {FilterReducer} from '../../features/reserved-area/consumer/coupon-showcase/redux-filter/filter.reducer';

export const rootReducer = combineReducers({
    login: LoginReducer,
    breadcrumb: BreadcrumbReducer,
    cart: CartReducer,
    filter: FilterReducer
  }
);
