import {CartState, CART_INITIAL_STATE} from './cart.model';
import {CART_INIT, CART_ADD_PROD, CART_DEL_PROD, CART_CHANGE_QNT, CART_UPDATE, CART_EMPTY} from './cart.actions';
import {CartItem} from '../../../../../shared/_models/CartItem';

export function CartReducer(state: CartState = CART_INITIAL_STATE, action): CartState {
  let cartAux: CartItem[];

  switch (action.type) {
    case CART_INIT:
      return Object.assign({}, state,{list: action.list});

    case CART_ADD_PROD:
      cartAux = state.list;
      cartAux.push(action.item);

      return Object.assign({}, state,{list: cartAux});

    case CART_DEL_PROD:
      return Object.assign({}, state,{list: state.list.filter((item) => item.id !== action.id )});

    case CART_CHANGE_QNT:
      cartAux = state.list;
      cartAux[action.index] = action.item;

      return Object.assign({}, state,{list: cartAux});

    case CART_UPDATE:
      return Object.assign({}, state,{list: action.list});

    case CART_EMPTY:
      return Object.assign({}, state,{list: []});

    default:
      return state;
  }
}
