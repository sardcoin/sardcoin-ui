import {Component, OnInit} from '@angular/core';
import {FiscalCodeValidation} from '../../validators/fiscal-code-validator.directive';
import {PasswordValidation} from '../../validators/password-validator.directive';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../../../shared/_services/user.service';
import {NgRedux, select} from '@angular-redux/store';
import {first} from 'rxjs/internal/operators';
import {IAppState} from '../../../../shared/store/model';
import {User} from '../../../../shared/_models/User';

@Component({
  selector: 'app-register-form-producer',
  templateUrl: './register-form-producer.component.html',
  styleUrls: ['./register-form-producer.component.scss']
})
export class RegisterFormProducerComponent implements OnInit {

  @select() username;
  @select() just_signed;

  registrationForm: FormGroup;
  // selectedUser = 'editor';
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private ngRedux: NgRedux<IAppState>
  ) {
  }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      first_name: ['', Validators.compose([Validators.maxLength(40), Validators.required])],
      last_name: ['', Validators.compose([Validators.maxLength(40), Validators.required])],
      birth_place: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      birth_date: ['', Validators.required],
      fiscal_code: ['', Validators.compose([Validators.maxLength(16), Validators.required])],
      email_paypal: [null, Validators.compose([Validators.maxLength(50)])],
      address: ['', Validators.compose([Validators.maxLength(100), Validators.required])],
      city: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      zip: ['', Validators.compose([Validators.maxLength(5), Validators.required])],
      province: ['', Validators.compose([Validators.maxLength(2), Validators.required])],
      username: ['', Validators.compose([Validators.maxLength(20), Validators.required])],
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(10), Validators.required])],
      r_password: ['', Validators.compose([Validators.minLength(10), Validators.required])],
      company_name: ['', Validators.required],
      vat_number: ['', Validators.required]
    }, {
      validator: Validators.compose([PasswordValidation.MatchPassword, FiscalCodeValidation.CheckFiscalCode])
    });
  }

  get f() {
    return this.registrationForm.controls;
  }


  onSubmit() {
    this.submitted = true;

    // If the registration form is invalid, return
    if (this.registrationForm.invalid) {
      this.loading = false;
      return;
    }

    // Setting some fanValues to pass to the backend
    this.registrationForm.value.user_type = 1;
    this.registrationForm.value.id = 0;
    this.registrationForm.value.checksum = 0;


    delete this.registrationForm.value.r_password;


    this.loading = true;

    this.userService.register(<User> this.registrationForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/authentication/login']);
        }, error => {
          this.loading = false;
          //console.log(error);
          console.log('User or email already exists');
        }
      );
  }
}
