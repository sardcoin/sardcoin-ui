import {CartItem} from '../../../../../shared/_models/CartItem';

export interface CartState {
  list: CartItem[];
}

export const CART_INITIAL_STATE: CartState = {
  list: []
};
