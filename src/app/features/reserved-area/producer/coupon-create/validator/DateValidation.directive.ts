import {AbstractControl} from '@angular/forms';

export class DateValidation {

  static CheckDateDay(AC: AbstractControl) {

    const dateFrom = Date.parse(AC.get('valid_from').value); // to get value in input tag
    let dateUntil;

    try {
      dateUntil = Date.parse(AC.get('valid_until').value);

      if (dateFrom < dateUntil) {
        return null;
      } else {
        AC.get('valid_until').setErrors({MatchDateFromUntil: true});
      }
    } catch (e) {
      return null;
    }
  }
}
