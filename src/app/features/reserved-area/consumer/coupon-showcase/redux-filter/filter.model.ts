import {Coupon} from '../../../../../shared/_models/Coupon';

export interface FilterState {
  list: Coupon[];
  // Here can go various filter settings (i.e.
}

export const FILTER_INITIAL_STATE: FilterState = {
  list: []
};
