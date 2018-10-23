import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {Breadcrumb} from '../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../core/breadcrumb/breadcrumb.actions';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {StoreService} from '../../../shared/_services/store.service';
import {DomSanitizer} from '@angular/platform-browser';
import {UserService} from '../../../shared/_services/user.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {select} from '@angular-redux/store';
import {PasswordValidation} from '../../authentication/validators/password-validator.directive';
import {FiscalCodeValidation} from '../../authentication/validators/fiscal-code-validator.directive';
import {first} from 'rxjs/internal/operators';
import {User} from '../../../shared/_models/User';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Credentials} from '../../authentication/login/login.model';
import {LoginActions} from '../../authentication/login/login.actions';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit, OnDestroy {
  bread = [] as Breadcrumb[];
  paymentForm: FormGroup;
  user: any;
  @select() username;
  @select() just_signed;
  selectedUser = 0;
  loading = false;
  done = false;
  successPassword = null;
  submitted = false;
  myForm: FormGroup;
  modalRef: BsModalRef;
  password: string;
  credentials: Credentials;


  constructor(private breadcrumbActions: BreadcrumbActions,
              private _sanitizer: DomSanitizer,
              private userService: UserService,
              private localStorage: LocalStorage,
              private localService: StoreService,
              private modalService: BsModalService,
              private router: Router,
              private loginActions: LoginActions,
  private authenticationService: AuthenticationService,
              private toastr: ToastrService,
              private formBuilder: FormBuilder) {
    this.paymentForm = this.formBuilder.group({
      first_name:   ['', Validators.compose([Validators.maxLength(40), Validators.required])],
      last_name:    ['', Validators.compose([Validators.maxLength(40), Validators.required])],
      birth_place:  ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      birth_date:   ['', Validators.required],
      fiscal_code:  ['', Validators.compose([Validators.maxLength(16), Validators.required])],
      email_paypal: ['' , Validators.compose([ Validators.maxLength(50), Validators.required])],
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
  }

  ngOnInit() {
    this.userService.getUserById().subscribe( user => {
      this.user = user;
      this.paymentForm = this.formBuilder.group({
        first_name:   [this.user.first_name, Validators.compose([Validators.maxLength(40), Validators.required])],
        last_name:    [this.user.last_name, Validators.compose([Validators.maxLength(40), Validators.required])],
        birth_place:  [this.user.birth_place, Validators.compose([Validators.maxLength(50), Validators.required])],
        birth_date:   [this.user.birth_date, Validators.required],
        fiscal_code:  [this.user.fiscal_code, Validators.compose([Validators.maxLength(16), Validators.required])],
        email_paypal: [this.user.email_paypal , Validators.compose([ Validators.maxLength(50), Validators.required])],
        address:      [this.user.address, Validators.compose([Validators.maxLength(100), Validators.required])],
        city:         [this.user.city, Validators.compose([Validators.maxLength(50), Validators.required])],
        zip:          [this.user.zip, Validators.compose([Validators.maxLength(5), Validators.required])],
        province:     [this.user.province, Validators.compose([Validators.maxLength(2), Validators.required])],
        username:     [this.user.username, Validators.compose([Validators.maxLength(20), Validators.required])],
        email:        [this.user.email, Validators.required],
        password:     [null],
        r_password:   [null],
        company_name: [this.user.company_name],
        vat_number:   [this.user.vat_number]
      }, {
        validator: Validators.compose([PasswordValidation.MatchPassword, FiscalCodeValidation.CheckFiscalCode])
      });
      this.selectChangeHandler (this.user.user_type);
      // console.log('this.registrationForm.value', this.paymentForm.value);
    });
    this.addBreadcrumb();

  }

  get f() { return this.paymentForm.controls; }
  get g() { return this.myForm.controls; }

  selectChangeHandler (user_type) {
    this.selectedUser = Number(user_type);

    if (this.selectedUser === 2) {
      // console.log('sto nel set');
      this.paymentForm.controls['company_name'].setValidators(Validators.required);
      this.paymentForm.controls['company_name'].updateValueAndValidity();

      this.paymentForm.controls['vat_number'].setValidators(Validators.required);
      this.paymentForm.controls['vat_number'].updateValueAndValidity();
    } else {
      // console.log('pulisco');
      this.paymentForm.controls['company_name'].setValidators(null);
      this.paymentForm.controls['company_name'].updateValueAndValidity();

      this.paymentForm.controls['vat_number'].setValidators(null);
      this.paymentForm.controls['vat_number'].updateValueAndValidity();
    }
  }
  onSubmit() {
    this.done = true;
    this.submitted = true;

    // If the registration form is invalid, return
    if (this.paymentForm.invalid) {
      this.loading = false;
      // console.log('this.paymentForm.invalid');
      return;
    }

    // Setting some fanValues to pass to the backend
    this.paymentForm.value.user_type = this.selectedUser;
    this.paymentForm.value.id = 0;
    this.paymentForm.value.checksum = 0;

    // If the user is not a company, put the fanValues to null
    if (this.selectedUser !== 2) {
      this.paymentForm.value.company_name = null;
      this.paymentForm.value.vat_number = null;
    }

    delete this.paymentForm.value.r_password;

    // console.log(this.paymentForm.value);

    this.loading = true;

    this.credentials = {
      username: this.user.username,
      password: this.myForm.value.password
    };
    // console.log('password', this.myForm.value.password)
    // console.log('user', this.user.username)
    const token = this.localService.getToken();
    this.loginActions.passwordControl();
    this.authenticationService.passwordControl(this.credentials, token, this.paymentForm.value)
      .pipe(first())
      .subscribe(data => {
        this.modalRef.hide();
        this.paymentForm.value.password = this.myForm.value.password;
            this.userService.update(<User> this.paymentForm.value)
              .pipe(first())
              .subscribe(
                up => {
                  this.modalRef.hide();
                  this.toastSuccessfull();
                  this.router.navigate(['/reserved-area/payment_details']);
                }, error1 => {
                  this.loading = false;
                  console.log('error1', error1);
                  console.log('No update user');
                }
              );
      }, error => {
        // this.loginActions.loginUserSuccess(this.paymentForm.value, token);
        this.loginActions.loginUserSuccess(this.paymentForm.value, token);
        this.successPassword = false;
        // this.router.navigate(['/reserved-area/payment_details']);
        console.log('error2', error);
        console.log('Wrong password');
      });

  }

  openModal(template: TemplateRef<any>) {
    this.submitted = true;
    this.myForm = this.formBuilder.group({
      user: [this.user.username],
      password: [ null , Validators.compose([Validators.required ])]

    });

    if (this.paymentForm.valid) {
      this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
    }
    }

  goToShowcase() {

    this.router.navigate(['/reserved-area/consumer/showcase']);
  }


  decline(): void {
    this.modalRef.hide();
  }

  toastSuccessfull() {
    this.toastr.success( 'Successful changes !!!');
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
    this.bread.push(new Breadcrumb('Payment Details', '/reserved-area/payment_details'));

    this.breadcrumbActions.updateBreadcrumb(this.bread);
  }

}
