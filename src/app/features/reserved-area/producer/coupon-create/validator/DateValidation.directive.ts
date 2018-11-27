import {AbstractControl} from '@angular/forms';

export class DateValidation {

  static CheckDateDay(AC: AbstractControl) {

    const dateFrom = Date.parse(AC.get('valid_from').value); // to get value in input tag
    let dateUntil;

    try {
      dateUntil = Date.parse(AC.get('valid_until').value);

      if(dateFrom < dateUntil) {
        return null;
      } else {
        AC.get('valid_until').setErrors({MatchDateFromUntil: true});
      }
    } catch (e) {
      return null;
    }

/*
    try {

      const dateFrom = Date.parse(AC.get('valid_from').value.valueOf()); // to get value in input tag
      let dateUntil;
      const dateUntilEmpty = Boolean(AC.get('valid_until_empty').value);

      try {
        dateUntil = Date.parse(AC.get('valid_until').value);
      } catch (e) {
        dateUntil = null;
      }

      if (dateUntilEmpty) {

        // AC.get('valid_until').setErrors(null);
        return null;

      } else if (isNaN(dateUntil) || dateUntil === null) {

        AC.get('valid_until').setErrors({MatchDateFromUntil: true});
      } else if (dateUntil < dateFrom) {

        AC.get('valid_until').setErrors({MatchDateFromUntil: true});

        return null;
      }

    } catch (err) {
      console.log('Error in DateValidation');
      console.log(err);
    }*/
  }
}
