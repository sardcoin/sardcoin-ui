import {AbstractControl} from '@angular/forms';

export class ImageValidation {

  static CheckImage(AC: AbstractControl) {

    try {
      const imagePath = Date.parse(AC.get('image').value.valueOf()); // to get value in input tag

      return null;
    } catch (Error) {
      AC.get('image').setErrors({NoPath: true});
    }

  }
}
