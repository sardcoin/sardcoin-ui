import {Component, OnInit, TemplateRef} from '@angular/core';
import {LoginActions} from '../../features/authentication/login/login.actions';
import {StoreService} from '../../shared/_services/store.service';
import {AuthenticationService} from '../../features/authentication/authentication.service';
import {GlobalEventsManagerService} from '../../shared/_services/global-event-manager.service';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {CartActions} from '../../features/reserved-area/consumer/cart/redux-cart/cart.actions';
import {Router} from '@angular/router';
import { Directive, HostBinding, HostListener } from '@angular/core';


@Component({
  selector: 'app-core-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']

})





export class HeaderComponent implements OnInit {


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
  navbarCollapsed = true;
  public _opened = false;


  constructor(
    private actions: LoginActions,
    private router: Router,
    private localStore: StoreService,
    private authService: AuthenticationService,
    private cartActions: CartActions,
    private globalEventService: GlobalEventsManagerService,
    private modalService: BsModalService,
  ) {
    this.globalEventService.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
      this.username = this.localStore.getUserNames();
      this.globalEventService.userType.subscribe(val => {
        this.userType = val;

        switch (this.userType) {
          case '0': // admin
            this.userStringType = 'admin';
            return true;
          case '1': // producer
            this.userStringType = 'producer';
            return true;
          case '2': // consumer
          this.userStringType = 'consumer';
          return true;
          case '3': // verifier
            this.userStringType = 'verifier';
            return true;
        }
      });
    });


  }

  logout() {
    if (this.userType === 2) { // If the user is a consumer
      this.cartActions.emptyCart();
      this.modalRef.hide();
    }

    this.actions.logoutUser();
    this.authService.logout();
  }

  decline() {
    this.modalRef.hide();
  }

  openModal(template: TemplateRef<any>) {
    if (this.userType !== 2) { // If the user is not a consumer
      this.logout();
    } else {
      this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
    }
  }
  ngOnInit() {
    this.globalEventService.hideSource.subscribe(message => this.isHide = message);
    this.globalEventService.desktopMode.subscribe(message => this.isDesktop = message);
  }

  clickEvent(link?: string ) {
    console.log('this.hide prima', this.hide)
    this.hide = !this.hide;
    console.log('this.hide dopo', this.hide)

    if (link != null) {
     this.router.navigate([link]);
    }
   }
  viewCart() {
    this.router.navigate(['/reserved-area/consumer/cart']);
  }

  quantityCart() {

    return this.cartActions.getQuantityCart();
  }
}
