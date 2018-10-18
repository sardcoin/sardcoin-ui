

import {AbstractControl} from '@angular/forms';

export class DateFromValidation {

  static CheckDateDay(AC: AbstractControl) {

    try {

      const dateFrom = Date.parse(AC.get('valid_from').value.valueOf()); // to get value in input tag
      const dateUntilEmpty = Boolean(AC.get('valid_until_empty').value);
      let dateUntil = Date.parse(AC.get('valid_until').value.valueOf());
      console.log('adesso', dateFrom, dateUntilEmpty, dateUntil );
      if (dateUntilEmpty) {

        AC.get('valid_until').setErrors(null);

        // console.log('dateUntilEmpty', dateFrom, dateUntilEmpty, dateUntil );

        dateUntil = null;
        return null;
      } else if ( isNaN(dateUntil )) {
        // console.log('dateUntil === NaN', dateFrom, dateUntilEmpty, dateUntil );

        AC.get('valid_until').setErrors({MatchDateFromUntil: true});
      } else if (dateUntil < dateFrom) {
        // console.log('dateUntil < dateFrom', dateFrom, dateUntilEmpty, dateUntil );

        AC.get('valid_until').setErrors({MatchDateFromUntil: true});



        return null;
      }
    } catch (Error) {
      console.log('error', Error);
    }

  }
}
