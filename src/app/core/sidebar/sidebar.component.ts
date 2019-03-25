import {Component, HostListener, OnInit} from '@angular/core';
import {GlobalEventsManagerService} from '../../shared/_services/global-event-manager.service';
import {AuthenticationService} from '../../features/authentication/authentication.service';
import {LoginActions} from '../../features/authentication/login/login.actions';
import {StoreService} from '../../shared/_services/store.service';

@Component({
  selector: 'app-core-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {
  isUserLoggedIn = false;
  userType = null;
  sidebarClass = 'sidebar-expanded d-none d-md-block col-1-5'; // default value
  userStringType = '';

  hide = false;
  desktopMode = true;

  constructor(
    private globalEventService: GlobalEventsManagerService,
  ) {
    this.globalEventService.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    this.globalEventService.hideSource.subscribe(value => {
      this.hide = value;
    });

    this.globalEventService.userType.subscribe(value => {
      this.userType = value;

      switch (this.userType) {
        case '0': // admin
          this.userStringType = 'admin';
          this.sendHide(false);
          break;
        case '1': // producer
          this.userStringType = 'producer';
          this.sendHide(false);
          break;
        case '2': // consumer
          this.userStringType = 'consumer';
          // this.hide = true;
          this.sendHide(true);
          break;
        case '3': // verify
          this.userStringType = 'verify';
          this.sendHide(false);
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
}
