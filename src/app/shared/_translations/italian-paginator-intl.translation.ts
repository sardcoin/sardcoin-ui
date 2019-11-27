import { MatPaginatorIntl } from '@angular/material';

const italianRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length === 0 || pageSize === 0) {
    return `0 di ${length}`;
  }

  const newLenght = Math.max(length, 0);
  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < newLenght ?
    Math.min(startIndex + pageSize, newLenght) :
    startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} di ${newLenght}`;
};

export const getItalianPaginatorIntl = (): MatPaginatorIntl => {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.nextPageLabel     = 'Pagina successiva';
  paginatorIntl.lastPageLabel     = 'Ultima pagina';
  paginatorIntl.firstPageLabel    = 'Prima pagina';
  paginatorIntl.getRangeLabel     =  italianRangeLabel;
  paginatorIntl.itemsPerPageLabel = 'Elementi per pagina:';
  paginatorIntl.previousPageLabel = 'Pagina precedente';

  return paginatorIntl;
};
