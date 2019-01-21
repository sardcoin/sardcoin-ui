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

    this.globalEventService.userType.subscribe(value => {
      this.userType = value;

      switch (this.userType) {
        case '0': // admin
          this.userStringType = 'admin';
          return true;
        case '1': // producer
          this.userStringType = 'producer';
          return true;
        case '2': // consumer
          // this.userStringType = 'consumer';
          // return true;
        case '3': // verifier
          this.userStringType = 'verifier';
          return true;
      }
    });
  }

  ngOnInit() {
    this.isHide();

    this.sidebarClass = 'sidebar-expanded d-none d-md-block col-1-5';

    this.globalEventService.hideSource.subscribe(message => {
      this.hide = message
    });

    this.globalEventService.desktopMode.subscribe(message => {
      this.desktopMode = message
    });
  }


  hideSideBar(value: boolean) {
    this.globalEventService.changeHide(value);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isHide();
  }

  isHide() {
    const innerWidth = window.innerWidth;
    if (innerWidth < 768) {
      this.hide = true;
      this.desktopMode = false;
      this.globalEventService.changeHide(true);
      this.globalEventService.changeView(false);

    } else {
      this.desktopMode = true;
      this.hide = false;
      this.globalEventService.changeHide(false);
      this.globalEventService.changeView(true);

    }

  }

}
