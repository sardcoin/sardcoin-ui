import {Breadcrumb} from './Breadcrumb';

export interface BreadcrumbState {
  list: Breadcrumb[];
  cartLength: number;
}

export const BREADCRUMB_INITIAL_STATE: BreadcrumbState = {
  list: [],
  cartLength: 0
};
