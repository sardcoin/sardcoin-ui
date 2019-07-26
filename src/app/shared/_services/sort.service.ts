import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SortService {

  constructor() {
  }

  private columnSortedSource = new Subject<ColumnSortedEvent>();

  columnSorted$ = this.columnSortedSource.asObservable();

  columnSorted(event: ColumnSortedEvent) {
    this.columnSortedSource.next(event);
  }

  getDataSortedByCriteria<T>(data: T[], criteria: ColumnSortedEvent): T[] {
    return data.sort((a: T, b: T) => {
      // console.log(this.getCriteria(a[criteria.sortColumn], a[criteria.sortColumn]));
      // console.log(this.isString(a[criteria.sortColumn]));
      return criteria.sortDirection === 'desc' ? this.getCriteria(a[criteria.sortColumn], b[criteria.sortColumn]) : this.getCriteria(b[criteria.sortColumn], a[criteria.sortColumn]);
    });
  }

  private getCriteria(a, b): number {
    let result;

    switch (typeof a) {
      case 'string':
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
