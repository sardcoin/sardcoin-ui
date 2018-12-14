import {Component, OnInit, TemplateRef} from '@angular/core';
import {LoginActions} from '../../features/authentication/login/login.actions';
import {StoreService} from '../../shared/_services/store.service';
import {AuthenticationService} from '../../features/authentication/authentication.service';
import {GlobalEventsManagerService} from '../../shared/_services/global-event-manager.service';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {DataService} from '../DataService';

@Component({
  selector: 'app-core-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {

  isUserLoggedIn = false;
  username: string;
  modalRef: BsModalRef = null;
  userType = null;
  cart = null;
  message: string;
  image: string;
  cls: string;

  constructor(
    private actions: LoginActions,
    private localStore: StoreService,
    private authService: AuthenticationService,
    private globalEventService: GlobalEventsManagerService,
    private modalService: BsModalService,
    protected localStorage: LocalStorage,
    private data: DataService,

  ) {
    this.globalEventService.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
      this.username = this.localStore.getUserNames();
      this.globalEventService.userType.subscribe(type => {
        this.userType = type;
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

  openModal(template: TemplateRef<any>) {
    if ( this.userType == 2 || this.userType == 0) {
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
    this.data.currentMessage.subscribe(message => this.message = message);
    this.data.currentClass.subscribe(message => this.cls = message);

  }

  showSideBar() {
    if (this.message === 'viewSidebar') {
      this.data.changeMessage('noSmart');
      this.data.changeClass('sidebar-expanded');

    } else {
      this.data.changeMessage('viewSidebar');
      this.data.changeClass('sidebar-expanded ');

      this.image = 'assets/img/brand/sardcoin-logo.png';
    }
  }

}
