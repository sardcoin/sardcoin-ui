import {FILTER_INITIAL_STATE, FilterState} from './filter.model';
import {FILTER_CLEAR, FILTER_UPDATE} from './filter.actions';

export function FilterReducer(state: FilterState = FILTER_INITIAL_STATE, action): FilterState {
  switch (action.type) {
    case FILTER_UPDATE:
      return Object.assign({}, state,{list: action.list, category: action.category, searchText: action.searchText});
    case FILTER_CLEAR:
      return Object.assign({}, state,{list: null, searchText: null, category: null});
    default:
      return state;
  }
}
