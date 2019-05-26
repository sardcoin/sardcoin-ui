import {Component, OnInit, TemplateRef} from '@angular/core';
import {LoginActions} from '../../features/authentication/login/login.actions';
import {StoreService} from '../../shared/_services/store.service';
import {AuthenticationService} from '../../features/authentication/authentication.service';
import {GlobalEventsManagerService} from '../../shared/_services/global-event-manager.service';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {CartActions} from '../../features/reserved-area/consumer/cart/redux-cart/cart.actions';
import {Router} from '@angular/router';
import {FilterActions} from '../../features/reserved-area/consumer/coupon-showcase/redux-filter/filter.actions';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {LoginState} from '../../features/authentication/login/login.model';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-core-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']

})

export class HeaderComponent implements OnInit {

  @select() login$: Observable<LoginState>;

  isUserLoggedIn = false;
  username: string;
  modalRef: BsModalRef = null;
  userType = null;
  userStringType: string;
  cart = null;
  isHide: boolean;
  hide = true;
  image: string;
  isDesktop: boolean;

  constructor(
    private actions: LoginActions,
    private router: Router,
    private toastr: ToastrService,
    private localStore: StoreService,
    private authService: AuthenticationService,
    private cartActions: CartActions,
    private globalEventService: GlobalEventsManagerService,
    private modalService: BsModalService,
    private filterActions: FilterActions
  ) {

    this.login$.subscribe(login => {
      this.isUserLoggedIn = login.isLogged;

      this.username = this.localStore.getUserNames();
      this.globalEventService.userType.subscribe(val => {
        this.userType = val;

        switch (this.userType) {
          case '0': // admin
            this.userStringType = 'admin';
            break;
          case '1': // producer
            this.userStringType = 'producer';
            break;
          case '3': // verify
            this.userStringType = 'verify';
            break;
          case '2': // The user is assumed to be a consumer if it's not logged in
          default:
            this.userStringType = 'consumer';
            break;
        }
      });
    });
  }

  logout() {
    if (this.userType == 2) { // If the user is a consumer
      this.cartActions.emptyCart();
      this.modalRef.hide();
    }

    this.actions.logoutUser();
    this.toastr.success('', 'Logout riuscito.');
  }

  decline() {
    this.modalRef.hide();
  }

  openModal(template: TemplateRef<any>) {
    if (this.userType != 2) { // If the user is not a consumer
      this.logout();
    } else {
      this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
    }
  }

  ngOnInit() {
    this.globalEventService.hideSource.subscribe(message => this.isHide = message);
    this.globalEventService.desktopMode.subscribe(message => this.isDesktop = message);
  }

  clickEvent(link?: string) {
    if (link) {
      this.router.navigate([link]);
    }
  }

  viewCart() {
    this.router.navigate(['/cart']);
  }

  quantityCart() {
    return this.cartActions.getQuantityCart();
  }

  resetShowcase(){
    this.filterActions.clear();
  }
}
