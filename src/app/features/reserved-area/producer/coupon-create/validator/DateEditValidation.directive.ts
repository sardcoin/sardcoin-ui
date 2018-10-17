import {AbstractControl} from '@angular/forms';

export class DateEditValidation {

  static CheckDateDay(AC: AbstractControl) {

    const dateFrom = Date.parse(AC.get('valid_from').value.valueOf()); // to get value in input tag
    const dateFromOld = Date.parse(AC.get('valid_from_old').value.valueOf()); // to get value in input tag
    const dateTimeDay = new Date().getTime().valueOf(); // to get value in input tag
    console.log(Date.parse(AC.get('valid_until').value.valueOf()))
    if (dateFromOld < dateTimeDay) {
      try {
        const dateUntil = Date.parse(AC.get('valid_until').value.valueOf());
        if (AC.get('valid_until') === null) {
          return null;
        }
        if (dateFrom < dateFromOld) {
          AC.get('valid_from').setErrors({MatchDate: true});
        } else {

          if (dateUntil < dateFrom && AC.get('valid_until') !== null) {
            AC.get('valid_until').setErrors({MatchDateFromUntil: true});
          } else {
            return null;
          }
        }
      } catch (Error) {
        // dateUntil does not exists

        if (dateFrom < dateFromOld) {
          AC.get('valid_from').setErrors({MatchDate: true});
        } else {
          return null;
        }
      }

    } else {
      try {
        const dateUntil = Date.parse(AC.get('valid_until').value.valueOf());

        if (dateFrom < dateTimeDay) {
          AC.get('valid_from').setErrors({MatchDate: true});
        } else {

          if (dateUntil < dateFrom && AC.get('valid_until') !== null) {
            AC.get('valid_until').setErrors({MatchDateFromUntil: true});
          } else {
            return null;
          }
        }
      } catch (Error) {
        // dateUntil does not exists

        if (dateFrom < dateTimeDay) {
          AC.get('valid_from').setErrors({MatchDate: true});
        } else {
          return null;
        }
      }

    }
  }

}
