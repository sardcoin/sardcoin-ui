import {Component, OnInit, TemplateRef} from '@angular/core';
import {LoginActions} from '../../features/authentication/login/login.actions';
import {StoreService} from '../../shared/_services/store.service';
import {AuthenticationService} from '../../features/authentication/authentication.service';
import {GlobalEventsManagerService} from '../../shared/_services/global-event-manager.service';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {LocalStorage} from '@ngx-pwa/local-storage';


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
  image: string;
  isDesktop: boolean;
  constructor(
    private actions: LoginActions,
    private localStore: StoreService,
    private authService: AuthenticationService,
    private globalEventService: GlobalEventsManagerService,
    private modalService: BsModalService,
    protected localStorage: LocalStorage,

  ) {
    this.globalEventService.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
      this.username = this.localStore.getUserNames();
      this.globalEventService.userType.subscribe(type => {
        this.userType = type;

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
    if (this.modalRef != null) {
      this.localStorage.removeItem('cart').subscribe(() => {
        this.actions.logoutUser();
        this.authService.logout();
        this.modalRef.hide();
      });
    } else {
      this.actions.logoutUser();
      this.authService.logout();
    }
  }

  decline() {
    this.modalRef.hide();
  }

  openModal(template: TemplateRef<any>) { // TODO Controllare il nuovo carrello
    if ( this.userType === 2 || this.userType === 0) { // TODO fix user types (what are 0 and 2??)
      this.localStorage.getItem('cart').subscribe(cart => {
        if (cart !== null) {
          this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
        } else {
          this.logout();
        }
      });
    } else {
      this.logout();
    }
  }
  ngOnInit() {
    this.globalEventService.hideSource.subscribe(message => this.isHide = message);
    this.globalEventService.desktopMode.subscribe(message => this.isDesktop = message);

  }

  showSideBar() {

    if (this.isHide === true) {
      console.log('this.isHide', this.isHide)
      this.globalEventService.changeHide(false);

    } else {
      console.log('this.isHide', this.isHide)
      this.globalEventService.changeHide(true);

    }
    // console.log('this.message', this.message);

  }

}
