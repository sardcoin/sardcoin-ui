

import {AbstractControl} from '@angular/forms';

export class DateFromValidation {

  static CheckDateDay(AC: AbstractControl) {

    try {

      const dateFrom = Date.parse(AC.get('valid_from').value.valueOf()); // to get value in input tag
      const dateUntilEmpty = Boolean(AC.get('valid_until_empty').value);


        let dateUntil = Date.parse(AC.get('valid_until').value);

        if (dateUntilEmpty) {

          AC.get('valid_until').setErrors(null);


          dateUntil = null;
          return null;
        } else if (isNaN(dateUntil) || dateUntil === null) {

          AC.get('valid_until').setErrors({MatchDateFromUntil: true});
        } else if (dateUntil < dateFrom) {

          AC.get('valid_until').setErrors({MatchDateFromUntil: true});


          return null;
        }

    } catch (Error) {
      console.log('error', Error);
    }

  }
}
