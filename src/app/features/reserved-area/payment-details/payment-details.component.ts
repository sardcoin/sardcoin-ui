import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {StoreService} from '../../../shared/_services/store.service';
import {DomSanitizer} from '@angular/platform-browser';
import {UserService} from '../../../shared/_services/user.service';
import {ToastrService} from 'ngx-toastr';
import {BreadcrumbActions} from '../../../core/breadcrumb/breadcrumb.actions';
import {Router} from '@angular/router';
import {User} from '../../../shared/_models/User';
import {Breadcrumb} from '../../../core/breadcrumb/Breadcrumb';
import {select} from '@angular-redux/store';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordValidation} from '../../authentication/validators/password-validator.directive';
import {FiscalCodeValidation} from '../../authentication/validators/fiscal-code-validator.directive';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {LoginActions} from '../../authentication/login/login.actions';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentDetailsComponent implements OnInit, OnDestroy {
  user: any = null;
  @select() username;
  @select() just_signed;

  updatePaypalCredentials: FormGroup;
  selectedUser = 0;
  loading = false;
  submitted = false;
  modalRef: BsModalRef;

  @ViewChild('updateInfo') updateInfo: ElementRef;

  constructor(
    private _sanitizer: DomSanitizer,
    private userService: UserService,
    private localStorage: LocalStorage,
    private localService: StoreService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private loginActions: LoginActions,
    private breadcrumbActions: BreadcrumbActions,
  ) {
  }

  ngOnInit(): void {
    this.addBreadcrumb();

    this.userService.getUserById().subscribe(user => {
      this.user = user;
      this.updatePaypalCredentials = this.formBuilder.group({
        email_paypal: [this.user.email_paypal, Validators.compose([Validators.maxLength(50), Validators.required])],
        client_id: [this.user.client_id, Validators.compose([Validators.maxLength(100), Validators.required])],
        password_secret: [this.user.password_secret, Validators.compose([Validators.maxLength(100), Validators.required])]
      });
    });
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  get f() {
    return this.updatePaypalCredentials.controls;
  }

  onSubmit() {
    this.submitted = true;

    // If the registration form is invalid, return
    if (this.updatePaypalCredentials.invalid) {
      this.loading = false;
      return;
    }

    // Setting some fanValues to pass to the backend
    this.updatePaypalCredentials.value.user_type = this.selectedUser;

    this.loading = true;

    this.openModal(this.updateInfo);
  }

  updateUser() {
    const user = this.updatePaypalCredentials.value;

    this.userService.updatePaypalCredentials(user)
      .subscribe(
        data => {
          if (data === null) {
            this.toastr.warning('Non è stato modificato alcun campo','Attenzione');
          }
          if (data['status']) {
            this.toastr.error('Si è verificato un errore durante l\'aggiornamento delle credenziali Paypal associate del profilo.', 'Errore di aggiornamento');
          } else {
            this.toastr.success('Occorre ripetere il login.', 'Profilo aggiornato con successo!');
            this.loginActions.logoutUser();
          }
        }, error => {
          console.log(error);
          this.toastr.error('Si è verificato un errore durante l\'aggiornamento delle credenziali Paypal associate del profilo.', 'Errore di aggiornamento');
        }
      );

    this.loading = false;
    this.closeModal();
  }

  openModal(template: ElementRef) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }

  closeModal(): void {
    this.modalRef.hide();
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/reserved-area/'));
    bread.push(new Breadcrumb('Credenziali Paypal', '/reserved-area/producer/payment-details'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }
}
