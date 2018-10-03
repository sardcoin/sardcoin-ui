import {Component, OnDestroy, OnInit} from '@angular/core';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {StoreService} from '../../../shared/_services/store.service';
import {CouponService} from '../../../shared/_services/coupon.service';
import {DomSanitizer} from '@angular/platform-browser';
import {UserService} from '../../../shared/_services/user.service';
import {ToastrService} from 'ngx-toastr';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BreadcrumbActions} from '../../../core/breadcrumb/breadcrumb.actions';
import {Router} from '@angular/router';
import {User} from '../../../shared/_models/User';
import {Breadcrumb} from '../../../core/breadcrumb/Breadcrumb';
import {NgRedux, select} from '@angular-redux/store';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IAppState} from '../../../shared/store/model';
import {PasswordValidation} from '../../authentication/validators/password-validator.directive';
import {FiscalCodeValidation} from '../../authentication/validators/fiscal-code-validator.directive';
import {first} from 'rxjs/internal/operators';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  bread = [] as Breadcrumb[];
  user: any;
  @select() username;
  @select() just_signed;

  updateRegistration: FormGroup;
  selectedUser = 0;
  loading = false;
  submitted = false;

  constructor(private _sanitizer: DomSanitizer,
              private userService: UserService,
              private localStorage: LocalStorage,
              private localService: StoreService,
              private router: Router,
              private toastr: ToastrService,
              private formBuilder: FormBuilder,
              private breadcrumbActions: BreadcrumbActions,
             ) {

    this.updateRegistration = this.formBuilder.group({
      first_name:   ['', Validators.compose([Validators.maxLength(40), Validators.required])],
      last_name:    ['', Validators.compose([Validators.maxLength(40), Validators.required])],
      birth_place:  ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      birth_date:   ['', Validators.required],
      fiscal_code:  ['', Validators.compose([Validators.maxLength(16), Validators.required])],
      email_paypal: [null , Validators.compose([ Validators.maxLength(50)])],
      address:      ['', Validators.compose([Validators.maxLength(100), Validators.required])],
      city:         ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      zip:          ['', Validators.compose([Validators.maxLength(5), Validators.required])],
      province:     ['', Validators.compose([Validators.maxLength(2), Validators.required])],
      username:     ['', Validators.compose([Validators.maxLength(20), Validators.required])],
      email:        ['', Validators.required],
      password:     ['', Validators.compose([Validators.minLength(10), Validators.required])],
      r_password:   ['', Validators.compose([Validators.minLength(10), Validators.required])],
      company_name: [''],
      vat_number:   ['']
    }, {
      validator: Validators.compose([PasswordValidation.MatchPassword, FiscalCodeValidation.CheckFiscalCode])
    });
    this.userService.getUserById().subscribe( user => {
      this.user = user;
      this.updateRegistration = this.formBuilder.group({
        first_name:   [this.user.first_name, Validators.compose([Validators.maxLength(40), Validators.required])],
        last_name:    [this.user.last_name, Validators.compose([Validators.maxLength(40), Validators.required])],
        birth_place:  [this.user.birth_place, Validators.compose([Validators.maxLength(50), Validators.required])],
        birth_date:   [this.user.birth_date, Validators.required],
        fiscal_code:  [this.user.fiscal_code, Validators.compose([Validators.maxLength(16), Validators.required])],
        email_paypal: [this.user.email_paypal , Validators.compose([ Validators.maxLength(50)])],
        address:      [this.user.address, Validators.compose([Validators.maxLength(100), Validators.required])],
        city:         [this.user.city, Validators.compose([Validators.maxLength(50), Validators.required])],
        zip:          [this.user.zip, Validators.compose([Validators.maxLength(5), Validators.required])],
        province:     [this.user.province, Validators.compose([Validators.maxLength(2), Validators.required])],
        username:     [this.user.username, Validators.compose([Validators.maxLength(20), Validators.required])],
        email:        [this.user.email, Validators.required],
        password:     ['', Validators.compose([Validators.minLength(10), Validators.required])],
        r_password:   ['', Validators.compose([Validators.minLength(10), Validators.required])],
        company_name: [this.user.company_name],
        vat_number:   [this.user.vat_number]
      }, {
        validator: Validators.compose([PasswordValidation.MatchPassword, FiscalCodeValidation.CheckFiscalCode])
      });
      this.selectChangeHandler (this.user.user_type);
      console.log('this.registrationForm.value', this.updateRegistration.value);
    });

  }

  ngOnInit(): void {
    this.addBreadcrumb();
  }


  get f() { return this.updateRegistration.controls; }

  selectChangeHandler (user_type) {
    this.selectedUser = Number(user_type);

    if (this.selectedUser === 2) {
      console.log('sto nel set');
      this.updateRegistration.controls['company_name'].setValidators(Validators.required);
      this.updateRegistration.controls['company_name'].updateValueAndValidity();

      this.updateRegistration.controls['vat_number'].setValidators(Validators.required);
      this.updateRegistration.controls['vat_number'].updateValueAndValidity();
    } else {
      console.log('pulisco');
      this.updateRegistration.controls['company_name'].setValidators(null);
      this.updateRegistration.controls['company_name'].updateValueAndValidity();

      this.updateRegistration.controls['vat_number'].setValidators(null);
      this.updateRegistration.controls['vat_number'].updateValueAndValidity();
    }
  }

  onSubmit() {
    this.submitted = true;

    // If the registration form is invalid, return
    if (this.updateRegistration.invalid) {
      this.loading = false;
      return;
    }

    // Setting some fanValues to pass to the backend
    this.updateRegistration.value.user_type = this.selectedUser;
    this.updateRegistration.value.id = 0;
    this.updateRegistration.value.checksum = 0;

    // If the user is not a company, put the fanValues to null
    if (this.selectedUser !== 2) {
      this.updateRegistration.value.company_name = null;
      this.updateRegistration.value.vat_number = null;
    }

    delete this.updateRegistration.value.r_password;

    console.log(this.updateRegistration.value);

    this.loading = true;

    this.userService.update(<User> this.updateRegistration.value)
      .pipe(first())
      .subscribe(
        data => {
          // this.setSignedUp(this.registrationForm.value.username);
          this.router.navigate(['/authentication/login']);
        }, error => {
          this.loading = false;
          console.log(error);
          console.log('User or email already exists');
        }
      );
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();

  }
  addBreadcrumb() {
    this.bread = [] as Breadcrumb[];

    this.bread.push(new Breadcrumb('Home', '/'));
    this.bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    this.bread.push(new Breadcrumb('Personal Info', '/reserved-area/personal_info'));

    this.breadcrumbActions.updateBreadcrumb(this.bread);
  }
}
