import {CartItem} from '../../../../../shared/_models/CartItem';

export interface CartState {
  list: CartItem[];
  total: number
}

export const CART_INITIAL_STATE: CartState = {
  list: [],
  total: 0
};
