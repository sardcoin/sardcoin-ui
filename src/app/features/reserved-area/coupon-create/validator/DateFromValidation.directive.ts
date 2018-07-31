import {AbstractControl} from '@angular/forms';
export class DateFromValidation {

  // TODO Controllare se dateUntil esiste prima di prelevarlo

  static CheckDateDay(AC: AbstractControl) {
    const dateFrom = Date.parse(AC.get('valid_from').value.valueOf()); // to get value in input tag
    const dateTimeDay = new Date().getTime().valueOf(); // to get value in input tag
    const dateUntil = Date.parse(AC.get('valid_until').value.valueOf());

    if (dateFrom < dateTimeDay) {
      AC.get('valid_from').setErrors( {MatchDate: true} );
    } else {
      if (dateUntil < dateFrom) {
        AC.get('valid_until').setErrors( {MatchDateFromUntil: true} );
      } else {
        return null;
      }
      return null;
    }

  }
}
