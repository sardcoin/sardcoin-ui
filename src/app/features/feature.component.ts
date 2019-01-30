import {Component, HostListener, OnInit} from '@angular/core';
import {GlobalEventsManagerService} from '../shared/_services/global-event-manager.service';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
})
export class FeatureComponent implements OnInit {

  desktopMode: boolean;
  userLogged: boolean;
  loginData;
  hide: boolean;
  width: string;
  constructor(
    private globalEventService: GlobalEventsManagerService,
  ){
    this.globalEventService.desktopMode.subscribe(message => {
      this.desktopMode = message
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
      // this.globalEventService.changeHide(true);
      this.globalEventService.changeView(false);
    } else {
      // this.globalEventService.changeHide(false);
      this.globalEventService.changeView(true);
    }
  }

  ngOnInit() {
    this.globalEventService.hideSource.subscribe(message => {
      this.hide = message;
      console.log('hhhiiiii', this.hide)
      if (this.hide) {

        this.width = '50px';
        console.log('this.width', this.width)

      } else {

        this.width = '230px';
        console.log('this.width', this.width)
      }



    });

  }
}
