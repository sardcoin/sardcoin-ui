import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../authentication.service';
import {Credentials} from '../login.model';
import {first} from 'rxjs/internal/operators';
import {LoginActions} from '../login.actions';
import {GlobalEventsManagerService} from '../../../../shared/_services/global-event-manager.service';
import {StoreService} from '../../../../shared/_services/store.service';

@Component({
  selector: 'app-feature-authentication-login-form',
  templateUrl: './login-form.component.html'
})
export class FeatureAuthenticationLoginFormComponent implements OnInit {

  loginForm: FormGroup;
  credentials: Credentials;
  loading = false;
  submitted = false;
  returnUrl: string;
  failed = false;
  userType = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private globalEventService: GlobalEventsManagerService,
    private loginActions: LoginActions,
    private storeLocal: StoreService,

  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = '';

    this.loginActions.logoutUser();
  }

  get f() { return this.loginForm.controls; }

  onSubmit () {

    // If submitted, the validators start
    this.submitted = true;

    // If the form is invalid, don't go ahead
    if (this.loginForm.invalid) {
      return;
    }

    // At this point, all validators are true
    this.loading = true;

    // Save the credentials to pass to the authentication service
    this.credentials = {
      username: this.f.username.value,
      password: this.f.password.value
    };

    this.authenticationService.login(this.credentials)
      .pipe(first())
      .subscribe(data => {
        setTimeout((response) => {

            this.userType = this.storeLocal.getType();
              if (this.userType !== null) {
                if (this.userType == 3) {
                  this.router.navigate(['reserved-area/verifier']);
                  return;
                } else {
                  this.router.navigate(['reserved-area']);
                  return;

                }
              }

          },
          500);
      }, error => {
        this.loading = false;
        this.failed = true;
      });


  }

}
