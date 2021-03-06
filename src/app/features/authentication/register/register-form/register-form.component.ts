import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import {PasswordValidation} from '../../validators/password-validator.directive';
import {FiscalCodeValidation} from '../../validators/fiscal-code-validator.directive';
import {UserService} from '../../../../shared/_services/user.service';
import {User} from '../../../../shared/_models/User';
import {first} from 'rxjs/internal/operators';
import {Router} from '@angular/router';
import {NgRedux, select} from '@angular-redux/store';
import {IAppState} from '../../../../shared/store/model';

@Component({
  selector: 'app-feature-authentication-register-form',
  templateUrl: './register-form.component.html'
})
export class FeatureAuthenticationRegisterFormComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @select() username;
  @select() just_signed;

  registrationForm: FormGroup;
  loading = false;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private ngRedux: NgRedux<IAppState>,
    private toastr: ToastrService

  ) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      first_name:   ['', Validators.compose([Validators.maxLength(40), Validators.required])],
      last_name:    ['', Validators.compose([Validators.maxLength(40), Validators.required])],
      fiscal_code:  ['', Validators.compose([Validators.maxLength(16), Validators.required])],
      username:     ['', Validators.compose([Validators.maxLength(20), Validators.required])],
      email:        ['', Validators.required],
      password:     ['', Validators.compose([Validators.minLength(10), Validators.required])],
      r_password:   ['', Validators.compose([Validators.minLength(10), Validators.required])],

    }, {
      validator: Validators.compose([PasswordValidation.MatchPassword, FiscalCodeValidation.CheckFiscalCode])
    });
  }

  get f() { return this.registrationForm.controls; }



  onSubmit() {
    this.submitted = true;

    // If the registration form is invalid, return
    if (this.registrationForm.invalid) {
      this.loading = false;
      return;
    }


    this.registrationForm.value.user_type = 2;
    this.registrationForm.value.id = 0;
    this.registrationForm.value.checksum = 0;
    this.registrationForm.value.birth_date = '';


    delete this.registrationForm.value.r_password;


    this.loading = true;
    this.blockUI.start('Attendi la registrazione su Blockchain'); // Start blocking

    this.userService.register(<User> this.registrationForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.blockUI.stop(); // Stop blocking

          this.toastr.success('', 'Registrazione avvenuta con successo!');

          this.router.navigate(['/authentication/login']);
        }, error => {
          this.loading = false;
          this.blockUI.stop(); // Stop blocking

          this.toastr.error('', 'Errore imprevisto in fase di registrazione. Riprova.');

          //console.log(error);
          //console.log('User or email already exists');
        }
      );
  }
}
