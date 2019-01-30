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

  hide = true;
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
          this.userStringType = 'consumer';
          return true;
        case '3': // verify
          this.userStringType = 'verify';
          return true;
      }
    });
  }

  ngOnInit() {
    this.sidebarClass = 'sidebar-expanded d-none d-md-block col-1-5';


    this.globalEventService.desktopMode.subscribe(message => {
      this.desktopMode = message
    });
  }


  hideSideBar(value: boolean) {
    this.globalEventService.changeHide(value);
  }

  // @HostListener('mouseover') onHover() {
  //   this.globalEventService.changeHide(false);
  //   this.hide = false;
  //   console.log(this.hide);
  // }

  // @HostListener('mouseout') onOut() {
  //   this.globalEventService.changeHide(true);
  //   this.hide = true;
  //   console.log(this.hide);
  //
  // }

  sendHideTrue() {

      this.globalEventService.changeHide(true);
      this.hide = true;
      console.log(this.hide);
  }

  sendHideFalse() {

    this.globalEventService.changeHide(false);
    this.hide = false;
    console.log(this.hide);
  }
}
