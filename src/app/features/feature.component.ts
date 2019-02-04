import {Component, HostListener, OnInit} from '@angular/core';
import {GlobalEventsManagerService} from '../shared/_services/global-event-manager.service';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
})
export class FeatureComponent implements OnInit {

  desktopMode: boolean;
  userType;
  loginData;
  hide: boolean;
  width: string;
  constructor(
    private globalEventService: GlobalEventsManagerService,
  ){
    this.globalEventService.desktopMode.subscribe(message => {
      this.desktopMode = message
    });

    this.globalEventService.userType.subscribe(value => {
      this.userType = value;
    });

    this.loginData = this.globalEventService.isUserLoggedIn.asObservable();
    this.isHide();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isHide();
  }

  isHide() {
    const innerWidth = window.innerWidth;
    if (innerWidth < 768) {
      this.globalEventService.changeView(false);
    } else {
      this.globalEventService.changeView(true);
    }
  }

  ngOnInit() {
    this.globalEventService.hideSource.subscribe(message => {
      this.hide = message;

      if (this.hide && this.userType == '2') {

        this.width = '50px';


      } else {

        this.width = '230px';

      }



    });

  }
}
