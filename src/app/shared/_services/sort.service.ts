import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SortService {

  stateWeight = {
    'Scaduto': 0,
    'Consumato': 1,
    'Disponibile': 2
  };

  constructor() {
  }

  private columnSortedSource = new Subject<ColumnSortedEvent>();

  columnSorted$ = this.columnSortedSource.asObservable();

  columnSorted(event: ColumnSortedEvent) {
    this.columnSortedSource.next(event);
  }

  getDataSortedByCriteria<T>(data: T[], criteria: ColumnSortedEvent): T[] {
    return data.sort((a: T, b: T) => {
      return criteria.sortDirection === 'desc'
        ? this.getCriteria(a[criteria.sortColumn], b[criteria.sortColumn], criteria.sortColumn)
        : this.getCriteria(b[criteria.sortColumn], a[criteria.sortColumn], criteria.sortColumn);
    });
  }

  private getCriteria(a, b, sortColumn): number {
    let result;

    switch (typeof a) {
      case 'string':
        a = sortColumn === 'state' ? this.stateWeight[a] : a;
        b = sortColumn === 'state' ? this.stateWeight[b] : b;
        result = a > b ? 1 : -1;
        break;
      case 'number':
        result = a - b;
        break;
    }

    return result;
  }



}

export interface ColumnSortedEvent {
  sortColumn: string;
  sortDirection: string;
}
