import {Component, OnInit} from '@angular/core';
import {GlobalEventsManagerService} from '../../shared/_services/global-event-manager.service';
import {FilterActions} from '../../features/reserved-area/consumer/coupon-showcase/redux-filter/filter.actions';
import {Observable} from 'rxjs';
import {LoginState} from '../../features/authentication/login/login.model';
import {select} from '@angular-redux/store';

@Component({
  selector: 'app-core-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {
  @select() login$: Observable<LoginState>;

  isUserLoggedIn = false;
  userType = null;
  sidebarClass = 'sidebar-expanded d-none d-md-block col-1-5'; // default value
  infoUserLink = '';

  hide = false;
  desktopMode = true;

  constructor(
    private globalEventService: GlobalEventsManagerService,
    private filterActions: FilterActions
  ) {
    // this.globalEventService.isUserLoggedIn.subscribe(value => {
    //   this.isUserLoggedIn = value;
    // });
    this.login$.subscribe(login => {
      this.isUserLoggedIn = login.isLogged;
    });

    this.globalEventService.hideSource.subscribe(value => {
      this.hide = value;
    });

    this.globalEventService.userType.subscribe(value => {
      this.userType = value;

      switch (this.userType) {
        case '0': // admin
          this.infoUserLink = '/reserved-area/admin/';
          this.sendHide(false);
          break;
        case '1': // producer
          this.infoUserLink = '/reserved-area/producer/';
          this.sendHide(false);
          break;
        case '3': // verify
          this.infoUserLink = '/reserved-area/verify/';
          this.sendHide(false);
          break;
        case '4': // broker
          this.infoUserLink = '/reserved-area/broker/';
          this.sendHide(false);
          break;
        case '2': // consumer
        default:
          this.infoUserLink = '/';
          // this.hide = true;
          this.sendHide(true);
          break;
      }
    });
  }

  ngOnInit() {
    this.sidebarClass = 'sidebar-expanded d-none d-md-block col-1-5';
    this.globalEventService.desktopMode.subscribe(message => {
      this.desktopMode = message;
    });
  }

  sendHide(signal: boolean) {
    this.globalEventService.changeHide(signal);
  }

  resetShowcase() {
    this.filterActions.clear();
  }
}
