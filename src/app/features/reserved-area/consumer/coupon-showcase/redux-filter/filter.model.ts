import {Coupon} from '../../../../../shared/_models/Coupon';
import {Category} from '../../../../../shared/_models/Category';

export interface FilterState {
  list: Coupon[];
  category: Category
  searchText: string;
  // Here can go various filter settings (i.e. date, place, etc.)
}

export const FILTER_INITIAL_STATE: FilterState = {
  list: null,
  category: null,
  searchText: null
};
