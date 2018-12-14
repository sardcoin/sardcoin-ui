import {Component, OnInit} from '@angular/core';
import {GlobalEventsManagerService} from '../../shared/_services/global-event-manager.service';
import {AuthenticationService} from '../../features/authentication/authentication.service';
import {LoginActions} from '../../features/authentication/login/login.actions';
import {StoreService} from '../../shared/_services/store.service';
import {DataService} from '../DataService';

@Component({
  selector: 'app-core-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit{
  isUserLoggedIn = false;
  userType = null;
  message: string;
  sidebarClass: string = "sidebar-expanded d-none d-md-block col-1-5"; //default value

  constructor(
    private actions: LoginActions,
    private localStore: StoreService,
    private authService: AuthenticationService,
    private globalEventService: GlobalEventsManagerService,
    private data: DataService
  ) {
    this.globalEventService.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    this.globalEventService.userType.subscribe(value => {
      this.userType = value;
    });
  }

  ngOnInit() {
    this.sidebarClass = "sidebar-expanded d-none d-md-block col-1-5";
    this.data.currentMessage.subscribe(message => this.message = message);
    this.data.currentClass.subscribe(message => {
      if(message == null) {
        this.sidebarClass = "sidebar-expanded d-none d-md-block col-1-5";

      } else {
        this.sidebarClass = message;
      }});


  }

}
